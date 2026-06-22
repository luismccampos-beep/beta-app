"""
Geocodifica hotéis em wv_hotels que não têm lat/lon usando Nominatim + Photon (OSM).

Lê directamente da BD Neon e grava os resultados de volta — sem CSV intermédio.

ESTRATÉGIA DE GEOCODIFICAÇÃO (melhorada):
1. Tentativa com "Hotel Name, City" (sem país) via Nominatim + viewbox
2. Fallback para "City" via Nominatim + viewbox
3. Fallback para "Hotel Name, City" via Photon API + lat/lon bias
4. Fallback para "City" via Photon API
5. Fallback para Google Maps Scraper API (Docker local em localhost:8001)

Não incluir o país na query resolve o problema de destinos com país errado
(ex: Praia do Rosa marcado como Portugal mas fica no Brasil).

RESUME: O script retoma sempre onde ficou. Usa dois marcadores de fonte:
  - 'geo_not_found'   → já foi tentado mas nenhum geocoder encontrou; ignorado na próxima vez
  - 'geo_found'       → coordenadas preenchidas com sucesso
  --retry-not-found   → força nova tentativa para os marcados 'geo_not_found'

Uso:
    # Instalar dependências (uma vez)
    py -3 -m pip install -r scripts/requirements-geocode-hotels.txt

    # Testar com 20 hotéis (sem escrever na BD)
    py -3 scripts/geocode-wv-hotels.py --dry-run --limit 20

    # Correr (retoma automaticamente onde parou)
    py -3 scripts/geocode-wv-hotels.py --limit 500

    # Correr para todos (demora horas — 1 req/seg por política do Nominatim)
    py -3 scripts/geocode-wv-hotels.py

    # Só hotéis de um país
    py -3 scripts/geocode-wv-hotels.py --country PT --limit 200

    # Nova tentativa para os que não foram encontrados antes
    py -3 scripts/geocode-wv-hotels.py --retry-not-found --limit 200

    # Ver progresso sem correr
    py -3 scripts/geocode-wv-hotels.py --status

Rate limit: 1 req/seg (exigido pelos termos do Nominatim/OSM).
"""

import argparse
import json
import os
import sys
import time
import logging
import urllib.request
import urllib.parse
import urllib.error
from pathlib import Path

logging.getLogger("geopy").setLevel(logging.ERROR)

import psycopg2
import psycopg2.extras
from dotenv import load_dotenv
from geopy.geocoders import Nominatim
from geopy.extra.rate_limiter import RateLimiter
from geopy.exc import GeocoderRateLimited, GeocoderTimedOut, GeocoderServiceError

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
ROOT = Path(__file__).parent.parent
load_dotenv(ROOT / ".env")
load_dotenv(ROOT / ".env.local", override=False)

DATABASE_URL = os.environ.get("DATABASE_URL_UNPOOLED") or os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    print("ERROR: DATABASE_URL not found in .env.local")
    sys.exit(1)

FONTE_NOT_FOUND = "geo_not_found"
FONTE_FOUND = "geo_found"
FONTE_WRONG_COUNTRY = "geo_wrong_country"

USER_AGENT = "beta-app-hotel-geocoder/1.0 (contact: admin@akmleva.com)"
VIEWBOX_SIZE = 0.5  # ~50km around destination center

# ---------------------------------------------------------------------------
# Args
# ---------------------------------------------------------------------------
parser = argparse.ArgumentParser(description="Geocode wv_hotels without lat/lon")
parser.add_argument("--limit", type=int, default=0,
                    help="Max hotels to process (0 = all)")
parser.add_argument("--country", type=str, default="",
                    help="Filter by pais_code (e.g. PT, BR)")
parser.add_argument("--dry-run", action="store_true",
                    help="Find coords but do not write to DB")
parser.add_argument("--delay", type=float, default=2.0,
                    help="Seconds between requests (min 1.0, default 2.0)")
parser.add_argument("--save-every", type=int, default=10,
                    help="Commit to DB every N processed hotels")
parser.add_argument("--retry-not-found", action="store_true",
                    help="Retry hotels previously marked as geo_not_found")
parser.add_argument("--no-gmaps", action="store_true",
                    help="Skip Google Maps Scraper API (strategy 5)")
parser.add_argument("--check-country", action="store_true",
                    help="Validate country of hotels with coordinates via reverse geocoding")
parser.add_argument("--check-country-limit", type=int, default=0,
                    help="Max hotels to check for country validation (0 = all)")
parser.add_argument("--status", action="store_true",
                    help="Print progress stats and exit (no geocoding)")
args = parser.parse_args()

DELAY = max(1.0, args.delay)
LIMIT = args.limit
DRY_RUN = args.dry_run
COUNTRY = args.country.upper()

# ---------------------------------------------------------------------------
# Geocoder setup
# ---------------------------------------------------------------------------
geolocator = Nominatim(user_agent=USER_AGENT)
geocode = RateLimiter(geolocator.geocode, min_delay_seconds=DELAY, max_retries=0, error_wait_seconds=DELAY)
reverse_geocode = RateLimiter(geolocator.reverse, min_delay_seconds=DELAY, max_retries=0, error_wait_seconds=DELAY)


# ---------------------------------------------------------------------------
# DB helpers
# ---------------------------------------------------------------------------
def get_connection():
    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = False
    return conn


def ensure_connection(conn):
    """Check if connection is alive; reconnect if closed or broken."""
    if conn.closed:
        print("  [DB] Connection lost, reconnecting...")
        try:
            conn.close()
        except Exception:
            pass
        new_conn = get_connection()
        return new_conn
    # Also try a lightweight ping to catch broken/zombie connections
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT 1")
    except psycopg2.OperationalError:
        print("  [DB] Connection broken, reconnecting...")
        try:
            conn.close()
        except Exception:
            pass
        new_conn = get_connection()
        return new_conn
    return conn


def print_status(conn):
    with conn.cursor() as cur:
        cur.execute("SELECT COUNT(*) FROM wv_hotels")
        total = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM wv_hotels WHERE latitude IS NOT NULL AND longitude IS NOT NULL")
        with_coords = cur.fetchone()[0]

        cur.execute(f"SELECT COUNT(*) FROM wv_hotels WHERE fonte = '{FONTE_NOT_FOUND}'")
        not_found_marked = cur.fetchone()[0]

        cur.execute(f"SELECT COUNT(*) FROM wv_hotels WHERE fonte = '{FONTE_FOUND}'")
        found_marked = cur.fetchone()[0]

        cur.execute("""
            SELECT COUNT(*) FROM wv_hotels
            WHERE latitude IS NULL AND longitude IS NULL
            AND (fonte IS NULL OR fonte NOT IN ('rejected_geo', 'geo_not_found'))
        """)
        pending = cur.fetchone()[0]

        cur.execute(f"SELECT COUNT(*) FROM wv_hotels WHERE fonte = '{FONTE_WRONG_COUNTRY}'")
        wrong_country_marked = cur.fetchone()[0]

        # Top 5 wrong country mismatches
        cur.execute(f"""
            SELECT d.pais, d.pais_code, COUNT(*) AS total
            FROM wv_hotels h
            JOIN wv_destinations d ON d.id = h.destino_id
            WHERE h.fonte = '{FONTE_WRONG_COUNTRY}'
            GROUP BY d.pais, d.pais_code
            ORDER BY total DESC
            LIMIT 5
        """)
        top_wrong = cur.fetchall()

    print(f"\n=== wv_hotels geocoding status ===")
    print(f"  Total hotels           : {total:,}")
    print(f"  With coordinates       : {with_coords:,}  ({with_coords/total*100:.1f}%)")
    print(f"  Marked geo_found       : {found_marked:,}")
    print(f"  Marked not_found       : {not_found_marked:,}  (skip, use --retry-not-found to redo)")
    print(f"  Marked wrong_country   : {wrong_country_marked:,}  (use --check-country to validate)")
    print(f"  Pending (untried)      : {pending:,}")
    print(f"  Still to geocode       : {total - with_coords:,}")
    if top_wrong:
        print(f"\n  Top wrong-country destinos:")
        for row in top_wrong:
            print(f"    {row[0]} ({row[1]}): {row[2]} hotéis")


def fetch_hotels(conn, limit: int, country: str, retry_not_found: bool):
    if retry_not_found:
        where = f"h.latitude IS NULL AND h.longitude IS NULL AND h.fonte = '{FONTE_NOT_FOUND}'"
    else:
        where = f"""
            h.latitude  IS NULL
            AND h.longitude IS NULL
            AND (h.fonte IS NULL OR h.fonte NOT IN ('rejected_geo', '{FONTE_NOT_FOUND}'))
        """

    sql = f"""
        SELECT
            h.id,
            h.nome,
            h.fonte,
            d.nome       AS dest_nome,
            d.pais       AS dest_pais,
            d.pais_code  AS dest_pais_code,
            d.latitude   AS dest_lat,
            d.longitude  AS dest_lon
        FROM wv_hotels h
        JOIN wv_destinations d ON d.id = h.destino_id
        WHERE {where}
    """
    params = []
    if country:
        sql += " AND d.pais_code = %s"
        params.append(country)

    sql += " ORDER BY h.id ASC"

    if limit:
        sql += " LIMIT %s"
        params.append(limit)

    with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
        cur.execute(sql, params)
        return cur.fetchall()


def update_hotel_found(conn, hotel_id: int, lat: float, lon: float):
    with conn.cursor() as cur:
        cur.execute(
            "UPDATE wv_hotels SET latitude = %s, longitude = %s, fonte = %s WHERE id = %s",
            (lat, lon, FONTE_FOUND, hotel_id),
        )


def update_hotel_not_found(conn, hotel_id: int):
    with conn.cursor() as cur:
        cur.execute("UPDATE wv_hotels SET fonte = %s WHERE id = %s",
                     (FONTE_NOT_FOUND, hotel_id))


def update_hotel_wrong_country(conn, hotel_id: int):
    with conn.cursor() as cur:
        cur.execute("UPDATE wv_hotels SET fonte = %s WHERE id = %s",
                     (FONTE_WRONG_COUNTRY, hotel_id))


def flush(conn):
    conn = ensure_connection(conn)
    conn.commit()
    return conn


def fetch_hotels_with_coords(conn, limit: int, country: str):
    """
    Fetch hotels that have coordinates but may have wrong country.
    Skips hotels already marked as geo_wrong_country or rejected_geo.
    """
    sql = f"""
        SELECT
            h.id,
            h.nome,
            h.latitude,
            h.longitude,
            h.fonte,
            d.id         AS dest_id,
            d.nome       AS dest_nome,
            d.pais       AS dest_pais,
            d.pais_code  AS dest_pais_code
        FROM wv_hotels h
        JOIN wv_destinations d ON d.id = h.destino_id
        WHERE h.latitude IS NOT NULL AND h.longitude IS NOT NULL
        AND (h.fonte IS NULL OR h.fonte NOT IN ('rejected_geo', '{FONTE_WRONG_COUNTRY}'))
    """
    params = []
    if country:
        sql += " AND d.pais_code = %s"
        params.append(country)

    sql += " ORDER BY h.id ASC"

    if limit:
        sql += " LIMIT %s"
        params.append(limit)

    with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
        cur.execute(sql, params)
        return cur.fetchall()


def run_country_check(conn):
    """
    --check-country mode: validates if hotels with coordinates are actually
    in the expected country via reverse geocoding.
    """
    dry_run = args.dry_run
    limit = args.check_country_limit or args.limit
    country_filter = COUNTRY

    print(f"=== Country validation via reverse geocoding ===")
    print(f"  dry-run={dry_run}  limit={limit or 'ALL'}  country={country_filter or 'ALL'}")
    print(f"  delay={DELAY}s")
    print()

    hotels = fetch_hotels_with_coords(conn, limit, country_filter)
    total = len(hotels)
    print(f"Hotels to check: {total}")

    if total == 0:
        print("Nothing to check.")
        return

    ok = 0
    wrong = 0
    errors = 0
    pending_commit = 0

    for i, row in enumerate(hotels, 1):
        hotel_id    = row["id"]
        hotel_nome  = row["nome"]
        lat         = row["latitude"]
        lon         = row["longitude"]
        dest_pais   = row["dest_pais"]
        dest_code   = row["dest_pais_code"]
        dest_nome   = row["dest_nome"]

        # Reverse geocode to find actual country
        actual_code = try_reverse_geocode(lat, lon)

        if actual_code is None:
            print(f"[{i}/{total}] ERR {hotel_nome} | {dest_nome} (reverse geocode failed)")
            errors += 1
            continue

        # Compare with expected country
        expected = (dest_code or "").upper()
        if expected and actual_code != expected:
            print(f"[{i}/{total}] WRONG {hotel_nome} | {dest_nome} expected={expected} actual={actual_code} -> ({lat:.4f}, {lon:.4f})")
            wrong += 1
            if not dry_run:
                update_hotel_wrong_country(conn, hotel_id)
                pending_commit += 1
        else:
            print(f"[{i}/{total}] OK {hotel_nome} | {dest_nome} code={actual_code}")
            ok += 1

        if not dry_run and pending_commit >= args.save_every:
            flush(conn)
            pending_commit = 0
            print(f"  -> committed (run {i}/{total}, wrong so far: {wrong})")

    if not dry_run and pending_commit:
        flush(conn)

    print(f"\n=== Country check complete ===")
    print(f"  Checked : {total}")
    print(f"  OK      : {ok}  (country matches)")
    print(f"  WRONG   : {wrong}  (marked '{FONTE_WRONG_COUNTRY}')")
    print(f"  Errors  : {errors}")
    if dry_run:
        print(f"  (dry-run - nothing written to DB)")


# ---------------------------------------------------------------------------
# Geocoding strategy (improved)
# ---------------------------------------------------------------------------
# IMPROVEMENT 1: No longer includes country in the query.
# The old query was "Hotel, City, Country" — but many destinations have
# wrong pais_code (e.g. "Praia do Rosa" marked as PT but is BR).
# Now we query without country and let the API determine location.
# ---------------------------------------------------------------------------

def build_query(hotel_name: str, dest_name: str) -> str:
    """Build search query WITHOUT country (avoids country misassignment)."""
    parts = [p for p in [hotel_name, dest_name] if p and p.strip()]
    return ", ".join(parts)


def make_viewbox(dest_lat, dest_lon, size_deg=VIEWBOX_SIZE):
    """
    Create a Nominatim viewbox parameter from destination coords.
    Returns None if coords are missing.
    Format: x1,y1,x2,y2 (lon1,lat1,lon2,lat2)
    """
    if dest_lat is None or dest_lon is None:
        return None
    if not (isinstance(dest_lat, (int, float)) and isinstance(dest_lon, (int, float))):
        return None
    if not (-90 <= dest_lat <= 90) or not (-180 <= dest_lon <= 180):
        return None
    lat, lon = float(dest_lat), float(dest_lon)
    half = size_deg / 2
    # viewbox: left,top,right,bottom  (lon_min,lat_max,lon_max,lat_min)
    return f"{lon - half},{lat + half},{lon + half},{lat - half}"


def try_geocode_nominatim(query: str, viewbox: str = None) -> tuple | None:
    """Try Nominatim (geopy). Supports viewbox for location bias."""
    max_attempts = 3
    kwargs = {"language": "en", "timeout": 10}
    if viewbox:
        kwargs["viewbox"] = viewbox
        # Note: not using bounded=1, because some destinations have inaccurate
        # lat/lon (e.g. country centroid) which would exclude valid results

    for attempt in range(max_attempts):
        try:
            location = geocode(query, **kwargs)
            if location:
                return (location.latitude, location.longitude)
            return None
        except GeocoderRateLimited:
            wait = 60 * (attempt + 1)
            print(f"    [Nominatim 429] waiting {wait}s... ({attempt+1}/{max_attempts})")
            time.sleep(wait)
        except GeocoderTimedOut:
            wait = 5 * (attempt + 1)
            print(f"    [Nominatim timeout] waiting {wait}s...")
            time.sleep(wait)
        except GeocoderServiceError as e:
            print(f"    [Nominatim error] {e}")
            return None
        except Exception as e:
            print(f"    [Nominatim exception] {e}")
            return None
    return None


def try_geocode_photon(query: str, lat: float = None, lon: float = None) -> tuple | None:
    """
    IMPROVEMENT 3: Photon API as alternative backend.
    Photon (https://photon.komoot.io) is built on OSM data and supports
    location bias via lat/lon parameters.
    """
    params = {
        "q": query,
        "limit": 5,
        "lang": "en",
    }
    if lat is not None and lon is not None:
        params["lat"] = str(lat)
        params["lon"] = str(lon)

    url = f"https://photon.komoot.io/api/?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        print(f"    [Photon error] {e}")
        return None

    features = data.get("features", [])
    if not features:
        return None

    # Return the best match (first result with valid geometry)
    for feat in features:
        coords = feat.get("geometry", {}).get("coordinates", [])
        if len(coords) == 2 and isinstance(coords[0], (int, float)):
            lon, lat = coords  # Photon returns [lon, lat]
            return (lat, lon)
    return None


def try_reverse_geocode(lat: float, lon: float) -> str | None:
    """
    Reverse geocode coordinates to find the actual country code (ISO alpha-2).
    Used by --check-country to validate if coordinates match the destination country.
    Returns e.g. 'CA', 'PT', 'BR' or None on failure.
    """
    if lat is None or lon is None:
        return None
    try:
        location = reverse_geocode((lat, lon), language='en')
        if location and location.raw:
            address = location.raw.get('address', {})
            country_code = address.get('country_code', '').upper()
            if country_code:
                return country_code
    except GeocoderRateLimited:
        print(f"    [Reverse 429] waiting 60s...")
        time.sleep(60)
    except GeocoderTimedOut:
        print(f"    [Reverse timeout] waiting 5s...")
        time.sleep(5)
    except Exception as e:
        print(f"    [Reverse error] {e}")
    return None


def try_geocode_gmaps(hotel_name: str, dest_name: str) -> tuple | None:
    """
    Strategy 5: Google Maps Scraper API (Docker local).
    Queries the gmaps_scraper API at localhost:8001 for "hotels in {dest_name}".
    Matches returned results by hotel name similarity.
    """
    if not dest_name:
        return None

    query = f"hoteis em {dest_name}"
    url = f"http://localhost:8001/scrape-get?query={urllib.parse.quote(query)}&max_places=15&lang=pt&headless=true&concurrency=1"

    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})

    try:
        with urllib.request.urlopen(req, timeout=180) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        print(f"    [GMaps error] {e}")
        return None

    if not data or not isinstance(data, list):
        return None

    # Try to find matching hotel by name similarity
    hotel_lower = hotel_name.lower().strip()
    best_match = None
    best_score = 0.0

    def _bigram_sim(a: str, b: str) -> float:
        """Dice coefficient on character bigrams."""
        if not a or not b:
            return 0.0
        bg_a = set(a[i:i+2] for i in range(len(a)-1))
        bg_b = set(b[i:i+2] for i in range(len(b)-1))
        if not bg_a or not bg_b:
            return 0.0
        return 2.0 * len(bg_a & bg_b) / (len(bg_a) + len(bg_b))

    for item in data:
        api_name = (item.get("name") or "").lower().strip()
        if not api_name:
            continue
        coords = item.get("coordinates") or {}
        lat = coords.get("latitude")
        lon = coords.get("longitude")
        if lat is None or lon is None:
            continue

        # Simple name similarity: check if one contains the other, or bigram overlap
        score = 0.0
        if hotel_lower == api_name:
            score = 1.0
        elif hotel_lower in api_name or api_name in hotel_lower:
            score = 0.9
        else:
            score = _bigram_sim(hotel_lower, api_name)

        if score > best_score:
            best_score = score
            best_match = (lat, lon, score, api_name)

    if best_match and best_match[2] >= 0.6:
        print(f'    [GMaps] match "{hotel_name}" -> "{best_match[3]}" (score={best_match[2]:.2f})')
        return (best_match[0], best_match[1])

    return None


def geocode_hotel(
    hotel_name: str,
    dest_name: str,
    dest_lat: float = None,
    dest_lon: float = None,
) -> tuple | None:
    """
    Multi-strategy geocoding:
    1. Nominatim with "Hotel, City" + viewbox bias
    2. Nominatim with "City" + viewbox bias
    3. Photon with "Hotel, City" + lat/lon bias
    4. Photon with "City" only
    5. Google Maps Scraper API (Docker local)
    """
    viewbox = make_viewbox(dest_lat, dest_lon)
    query_hotel = build_query(hotel_name, dest_name)
    query_city = build_query(dest_name, "")

    # Strategy 1: Nominatim "Hotel, City" + viewbox
    result = try_geocode_nominatim(query_hotel, viewbox)
    if result:
        return result

    # Strategy 2: Nominatim "City" + viewbox
    if dest_name:
        result = try_geocode_nominatim(query_city, viewbox)
        if result:
            return result

    # Strategy 3: Photon "Hotel, City" + lat/lon bias
    # Small delay before Photon calls (light rate limiting)
    time.sleep(0.5)
    result = try_geocode_photon(query_hotel, dest_lat, dest_lon)
    if result:
        return result

    # Strategy 4: Photon "City" only
    if dest_name:
        time.sleep(0.5)
        result = try_geocode_photon(query_city, dest_lat, dest_lon)
        if result:
            return result

    # Strategy 5: Google Maps Scraper API (Docker local) — can be disabled via --no-gmaps
    # Slow (~60-120s) but can find hotels that OSM doesn't have
    # Only use as last resort — the API is slow per request
    if not args.no_gmaps:
        time.sleep(0.5)
        result = try_geocode_gmaps(hotel_name, dest_name)
        if result:
            return result

    return None


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    conn = get_connection()

    if args.status:
        conn = ensure_connection(conn)
        print_status(conn)
        conn.close()
        return

    if args.check_country:
        conn = ensure_connection(conn)
        run_country_check(conn)
        conn.close()
        return

    mode = "retry-not-found" if args.retry_not_found else "resume"
    print(f"=== Geocode wv_hotels (Nominatim + Photon) ===")
    print(f"  mode={mode}  dry-run={DRY_RUN}  limit={LIMIT or 'ALL'}  "
          f"country={COUNTRY or 'ALL'}  delay={DELAY}s")
    print(f"  Strategy: 1.Nominatim(Hotel+City) 2.Nominatim(City) "
          f"3.Photon(Hotel+City) 4.Photon(City) 5.GoogleMapsScraper")
    print()

    conn = ensure_connection(conn)
    print_status(conn)
    print()

    conn = ensure_connection(conn)
    hotels = fetch_hotels(conn, LIMIT, COUNTRY, args.retry_not_found)
    total = len(hotels)
    print(f"Hotels to process this run: {total}")

    if total == 0:
        print("Nothing to do. All hotels are already geocoded or marked.")
        print("Use --retry-not-found to re-attempt previously failed hotels.")
        conn.close()
        return

    found = 0
    not_found = 0
    errors = 0
    pending_commit = 0
    strategy_stats = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}

    for i, row in enumerate(hotels, 1):
        hotel_id   = row["id"]
        hotel_nome = row["nome"]
        dest_nome  = row["dest_nome"]
        dest_lat   = row.get("dest_lat")
        dest_lon   = row.get("dest_lon")

        result = geocode_hotel(hotel_nome, dest_nome, dest_lat, dest_lon)

        if result:
            lat, lon = result
            print(f"[{i}/{total}] OK {hotel_nome} | {dest_nome} -> ({lat:.5f}, {lon:.5f})")
            found += 1
            if not DRY_RUN:
                conn = ensure_connection(conn)
                update_hotel_found(conn, hotel_id, lat, lon)
                pending_commit += 1
        else:
            print(f"[{i}/{total}] NO {hotel_nome} | {dest_nome}")
            not_found += 1
            if not DRY_RUN:
                conn = ensure_connection(conn)
                update_hotel_not_found(conn, hotel_id)
                pending_commit += 1

        if not DRY_RUN and pending_commit >= args.save_every:
            conn = flush(conn)
            pending_commit = 0
            print(f"  -> committed (run {i}/{total}, found so far: {found})")

    if not DRY_RUN and pending_commit:
        conn = flush(conn)

    conn.close()

    print(f"\n=== Run complete ===")
    print(f"  Processed  : {total}")
    print(f"  Found      : {found}")
    print(f"  Not found  : {not_found}  (marked '{FONTE_NOT_FOUND}')")
    print(f"  Errors     : {errors}")
    if DRY_RUN:
        print("  (dry-run - nothing written to DB)")
    else:
        print(f"  Use --retry-not-found to re-attempt the {not_found} not-found hotels.")


if __name__ == "__main__":
    main()
