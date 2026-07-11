#!/usr/bin/env python3
"""
Geocodifica hotéis em wv_hotels que não têm lat/lon usando Nominatim + Photon (OSM).

Lê directamente da BD Neon e grava os resultados de volta — sem CSV intermédio
para a geocodificação em si. Para segurança, o script também sabe fazer um
BACKUP local (JSON + CSV) de wv_hotels + wv_destinations sempre que pedido.

ESTRATÉGIA DE GEOCODIFICAÇÃO (melhorada):
1. Tentativa com "Hotel Name, City" (sem país) via Nominatim + viewbox
2. Fallback para "City" via Nominatim + viewbox
3. Fallback para "Hotel Name, City" via Photon API + lat/lon bias
4. Fallback para "City" via Photon API
5. Fallback para Google Maps Scraper API (Docker local em localhost:8001)

Não incluir o país na query resolve o problema de destinos com país errado
(ex: Praia do Rosa marcado como Portugal mas fica no Brasil).

RESUME: O script retoma sempre onde ficou. Usa dois marcadores de fonte:
  - 'geo_not_found'   -> já foi tentado mas nenhum geocoder encontrou; ignorado na próxima vez
  - 'geo_found'       -> coordenadas preenchidas com sucesso
  --retry-not-found   -> força nova tentativa para os marcados 'geo_not_found'

BACKUP / SEGURANÇA:
  Nada é apagado por defeito; os backups só acontecem quando pedidos com
  --backup ou --backup-only. Cada backup grava DOIS ficheiros no seu
  computador, dentro da pasta scripts/../backups/, com timestamp:
    wv_hotels_backup_AAAAMMDD_HHMMSS.json   (fiel aos tipos, para restauro)
    wv_hotels_backup_AAAAMMDD_HHMMSS.csv    (para abrir em Excel/Sheets)
  Contém wv_hotels feito JOIN com wv_destinations (nome, país, coords do
  destino incluídos), tal como a query usada para geocodificar.
  --backup-keep N controla quantos backups ficam guardados (default 10,
  0 = guardar todos para sempre). Os mais antigos são apagados automaticamente.

  --backup        faz o backup e DEPOIS continua a correr o resto do comando
                  (ex.: útil para teres sempre uma cópia de segurança antes de
                  escrever na BD)
  --backup-only   faz só o backup e sai (não geocodifica nada)

Uso:
    # Instalar dependências (uma vez)
    py -3 -m pip install -r scripts/requirements-geocode-hotels.txt

    # Fazer só um backup de segurança, sem geocodificar nada
    py -3 scripts/geocode-wv-hotels.py --backup-only

    # Fazer backup e a seguir correr a geocodificação normalmente
    py -3 scripts/geocode-wv-hotels.py --backup --limit 500

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

    # Manter só os últimos 5 backups (apaga os restantes automaticamente)
    py -3 scripts/geocode-wv-hotels.py --backup-only --backup-keep 5

Rate limit: 1 req/seg (exigido pelos termos do Nominatim/OSM).
"""

import argparse
import csv
import json
import os
import sys
import time
import urllib.request
import urllib.parse
import urllib.error
from datetime import datetime, date
from pathlib import Path

import psycopg2
import psycopg2.extras
from dotenv import load_dotenv

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

BACKUP_DIR = ROOT / "backups"
DEFAULT_BACKUP_KEEP = 10

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
parser.add_argument("--gmaps", action="store_true",
                     help="Enable Google Maps Scraper API (strategy 5, disabled by default)")
parser.add_argument("--photon", action="store_true",
                     help="Enable Photon API (strategy 3+4, disabled by default — times out on this network)")
parser.add_argument("--check-country", action="store_true",
                     help="Validate country of hotels with coordinates via reverse geocoding")
parser.add_argument("--check-country-limit", type=int, default=0,
                     help="Max hotels to check for country validation (0 = all)")
parser.add_argument("--status", action="store_true",
                     help="Print progress stats and exit (no geocoding)")
parser.add_argument("--backup", action="store_true",
                     help="Faz um backup local (JSON+CSV) de wv_hotels+wv_destinations "
                          "antes de continuar a correr o resto do comando")
parser.add_argument("--backup-only", action="store_true",
                     help="Faz só o backup local (JSON+CSV) e sai, sem geocodificar nada")
parser.add_argument("--backup-keep", type=int, default=DEFAULT_BACKUP_KEEP,
                     help=f"Nº de backups a manter no disco (default {DEFAULT_BACKUP_KEEP}; "
                          f"0 = guardar todos para sempre)")
args = parser.parse_args()

DELAY = max(1.0, args.delay)
LIMIT = args.limit
DRY_RUN = args.dry_run
COUNTRY = args.country.upper()

# (geocoders instantiated per-call — using urllib directly)


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
        return get_connection()
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
        return get_connection()
    return conn


def print_status(conn):
    with conn.cursor() as cur:
        cur.execute("SELECT COUNT(*) FROM wv_hotels")
        total = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM wv_hotels WHERE latitude IS NOT NULL AND longitude IS NOT NULL")
        with_coords = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM wv_hotels WHERE fonte = %s", (FONTE_NOT_FOUND,))
        not_found_marked = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM wv_hotels WHERE fonte = %s", (FONTE_FOUND,))
        found_marked = cur.fetchone()[0]

        cur.execute("""
            SELECT COUNT(*) FROM wv_hotels
            WHERE latitude IS NULL AND longitude IS NULL
            AND (fonte IS NULL OR fonte NOT IN ('rejected_geo', 'geo_not_found'))
        """)
        pending = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM wv_hotels WHERE fonte = %s", (FONTE_WRONG_COUNTRY,))
        wrong_country_marked = cur.fetchone()[0]

        # Top 5 wrong country mismatches
        cur.execute("""
            SELECT d.pais, d.pais_code, COUNT(*) AS total
            FROM wv_hotels h
            JOIN wv_destinations d ON d.id = h.destino_id
            WHERE h.fonte = %s
            GROUP BY d.pais, d.pais_code
            ORDER BY total DESC
            LIMIT 5
        """, (FONTE_WRONG_COUNTRY,))
        top_wrong = cur.fetchall()

    print(f"\n=== wv_hotels geocoding status ===")
    print(f"  Total hotels           : {total:,}")
    if total:
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


# ---------------------------------------------------------------------------
# Backup helpers (JSON + CSV, gravados no computador local)
# ---------------------------------------------------------------------------
def fetch_backup_rows(conn, country: str = ""):
    """Lê wv_hotels + wv_destinations (JOIN) para backup local."""
    sql = """
        SELECT
            h.id            AS hotel_id,
            h.nome          AS hotel_nome,
            h.latitude      AS hotel_latitude,
            h.longitude     AS hotel_longitude,
            h.fonte         AS hotel_fonte,
            h.destino_id    AS destino_id,
            d.nome          AS destino_nome,
            d.pais          AS destino_pais,
            d.pais_code     AS destino_pais_code,
            d.latitude      AS destino_latitude,
            d.longitude     AS destino_longitude
        FROM wv_hotels h
        JOIN wv_destinations d ON d.id = h.destino_id
    """
    params = []
    if country:
        sql += " WHERE d.pais_code = %s"
        params.append(country)
    sql += " ORDER BY h.id ASC"

    with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        cur.execute(sql, params)
        return cur.fetchall()


def _json_default(obj):
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    return str(obj)


def write_backup_json(rows, path: Path):
    data = [dict(r) for r in rows]
    path.write_text(
        json.dumps(data, ensure_ascii=False, indent=2, default=_json_default),
        encoding="utf-8",
    )


def write_backup_csv(rows, path: Path):
    if not rows:
        path.write_text("", encoding="utf-8-sig")
        return
    fieldnames = list(rows[0].keys())
    with path.open("w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for r in rows:
            writer.writerow(dict(r))


def prune_old_backups(keep: int):
    """Mantém só os `keep` backups mais recentes (0 = guardar todos)."""
    if keep <= 0:
        return
    json_files = sorted(
        BACKUP_DIR.glob("wv_hotels_backup_*.json"),
        key=lambda p: p.stat().st_mtime,
        reverse=True,
    )
    for old_json in json_files[keep:]:
        stem = old_json.stem  # wv_hotels_backup_AAAAMMDD_HHMMSS
        old_csv = BACKUP_DIR / f"{stem}.csv"
        for f in (old_json, old_csv):
            try:
                if f.exists():
                    f.unlink()
            except Exception as e:
                print(f"    [backup] não consegui apagar {f.name}: {e}")
        print(f"  [backup] removido backup antigo: {stem}")


def run_backup(conn, country: str, keep: int):
    """Cria backup JSON+CSV de wv_hotels+wv_destinations no computador local."""
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    json_path = BACKUP_DIR / f"wv_hotels_backup_{timestamp}.json"
    csv_path = BACKUP_DIR / f"wv_hotels_backup_{timestamp}.csv"

    print(f"\n=== A criar backup de segurança ===")
    print(f"  Pasta destino : {BACKUP_DIR.resolve()}")
    print(f"  A ler wv_hotels + wv_destinations da BD...")

    rows = fetch_backup_rows(conn, country)
    print(f"  {len(rows):,} registos lidos.")

    write_backup_json(rows, json_path)
    write_backup_csv(rows, csv_path)

    size_json_kb = json_path.stat().st_size / 1024
    size_csv_kb = csv_path.stat().st_size / 1024
    print(f"  JSON guardado : {json_path.name}  ({size_json_kb:.1f} KB)")
    print(f"  CSV  guardado : {csv_path.name}  ({size_csv_kb:.1f} KB)")

    prune_old_backups(keep)
    print(f"=== Backup concluído ===\n")
    return json_path, csv_path, len(rows)


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
        hotel_id = row["id"]
        hotel_nome = row["nome"]
        lat = row["latitude"]
        lon = row["longitude"]
        dest_pais = row["dest_pais"]
        dest_code = row["dest_pais_code"]
        dest_nome = row["dest_nome"]

        # Reverse geocode to find actual country
        actual_code = try_reverse_geocode(lat, lon)
        time.sleep(DELAY)

        if actual_code is None:
            print(f"[{i}/{total}] ERR {hotel_nome} | {dest_nome} (reverse geocode failed)")
            errors += 1
            continue

        # Compare with expected country
        expected = (dest_code or "").upper()
        if expected and actual_code != expected:
            print(f"[{i}/{total}] WRONG {hotel_nome} | {dest_nome} expected={expected} "
                  f"actual={actual_code} -> ({lat:.4f}, {lon:.4f})")
            wrong += 1
            if not dry_run:
                conn = ensure_connection(conn)
                update_hotel_wrong_country(conn, hotel_id)
                pending_commit += 1
        else:
            print(f"[{i}/{total}] OK {hotel_nome} | {dest_nome} code={actual_code}")
            ok += 1

        if not dry_run and pending_commit >= args.save_every:
            conn = flush(conn)
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


def try_geocode_nominatim(query: str, viewbox: str = None):
    """Try Nominatim via raw urllib (avoids geopy RateLimiter swallowing 429s)."""
    params = {
        "q": query,
        "format": "json",
        "limit": 1,
        "addressdetails": 1,
        "language": "en",
    }
    if viewbox:
        params["viewbox"] = viewbox

    url = f"https://nominatim.openstreetmap.org/search?{urllib.parse.urlencode(params)}"

    for attempt in range(2):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read())
            if data and len(data) > 0:
                return (float(data[0]["lat"]), float(data[0]["lon"]))
            return None
        except urllib.error.HTTPError as e:
            if e.code == 429:
                if attempt == 0:
                    print(f"    [Nominatim 429] waiting 60s...")
                    time.sleep(60)
                else:
                    print(f"    [Nominatim 429] giving up")
                    return None
            else:
                print(f"    [Nominatim HTTP {e.code}]")
                return None
        except (urllib.error.URLError, OSError):
            print(f"    [Nominatim timeout]")
            return None
        except Exception as e:
            print(f"    [Nominatim error] {e}")
            return None
    return None


def try_geocode_photon(query: str, lat: float = None, lon: float = None):
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
        with urllib.request.urlopen(req, timeout=3) as resp:
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
            f_lon, f_lat = coords  # Photon returns [lon, lat]
            return (f_lat, f_lon)
    return None


def try_reverse_geocode(lat: float, lon: float):
    """
    Reverse geocode coordinates to find the actual country code (ISO alpha-2).
    Used by --check-country to validate if coordinates match the destination country.
    Returns e.g. 'CA', 'PT', 'BR' or None on failure.
    """
    if lat is None or lon is None:
        return None
    params = {"lat": lat, "lon": lon, "format": "json", "language": "en"}
    url = f"https://nominatim.openstreetmap.org/reverse?{urllib.parse.urlencode(params)}"
    for attempt in range(2):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read())
            address = data.get("address", {}) if data else {}
            country_code = address.get("country_code", "").upper()
            if country_code:
                return country_code
            return None
        except urllib.error.HTTPError as e:
            if e.code == 429:
                if attempt == 0:
                    print(f"    [Reverse 429] waiting 60s...")
                    time.sleep(60)
                else:
                    return None
            else:
                return None
        except (urllib.error.URLError, OSError):
            print(f"    [Reverse timeout]")
            return None
        except Exception as e:
            print(f"    [Reverse error] {e}")
            return None
    return None


def try_geocode_gmaps(hotel_name: str, dest_name: str):
    """
    Strategy 5: Google Maps Scraper API (Docker local).
    Queries the gmaps_scraper API at localhost:8001 for "hotels in {dest_name}".
    Matches returned results by hotel name similarity.
    """
    if not dest_name:
        return None

    query = f"hoteis em {dest_name}"
    qs = urllib.parse.urlencode({
        "query": query,
        "max_places": 15,
        "lang": "pt",
        "headless": "true",
        "concurrency": 1,
    })
    url = f"http://localhost:8001/scrape-get?{qs}"

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

    def bigram_sim(a: str, b: str) -> float:
        """Dice coefficient on character bigrams."""
        if not a or not b:
            return 0.0
        bg_a = set(a[i:i + 2] for i in range(len(a) - 1))
        bg_b = set(b[i:i + 2] for i in range(len(b) - 1))
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
        if hotel_lower == api_name:
            score = 1.0
        elif hotel_lower in api_name or api_name in hotel_lower:
            score = 0.9
        else:
            score = bigram_sim(hotel_lower, api_name)

        if score > best_score:
            best_score = score
            best_match = (lat, lon, score, api_name)

    if best_match and best_match[2] >= 0.6:
        print(f'    [GMaps] match "{hotel_name}" -> "{best_match[3]}" (score={best_match[2]:.2f})')
        return (best_match[0], best_match[1])

    return None


def geocode_hotel(hotel_name: str, dest_name: str, dest_lat: float = None, dest_lon: float = None):
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

    # Strategy 3: Photon "Hotel, City" + lat/lon bias (disabled by default — blocked on this network)
    if args.photon:
        time.sleep(0.5)
        result = try_geocode_photon(query_hotel, dest_lat, dest_lon)
        if result:
            return result

    # Strategy 4: Photon "City" only
    if args.photon and dest_name:
        time.sleep(0.5)
        result = try_geocode_photon(query_city, dest_lat, dest_lon)
        if result:
            return result

    # Strategy 5: Google Maps Scraper API (Docker local) — opt-in via --gmaps
    # Slow (~60-120s) but can find hotels that OSM doesn't have.
    # Only use as last resort — the API is slow per request.
    if args.gmaps:
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

    # --- Backup (opt-in, roda antes de tudo o resto para máxima segurança) ---
    if args.backup or args.backup_only:
        conn = ensure_connection(conn)
        try:
            run_backup(conn, COUNTRY, args.backup_keep)
        except Exception as e:
            print(f"ERRO ao criar backup: {e}")
            if args.backup_only:
                conn.close()
                sys.exit(1)
        if args.backup_only:
            conn.close()
            return

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
          f"3.Photon(Hotel+City) 4.Photon(City) [{'ON' if args.photon else 'OFF'}] "
          f"5.GoogleMapsScraper [{'ON' if args.gmaps else 'OFF'}]")
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

    try:
        for i, row in enumerate(hotels, 1):
            hotel_id = row["id"]
            hotel_nome = row["nome"]
            dest_nome = row["dest_nome"]
            dest_lat = row["dest_lat"]
            dest_lon = row["dest_lon"]

            try:
                result = geocode_hotel(hotel_nome, dest_nome, dest_lat, dest_lon)
            except Exception as e:
                print(f"[{i}/{total}] ERR {hotel_nome} | {dest_nome} -> {e}")
                errors += 1
                result = None

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

            time.sleep(DELAY)

        if not DRY_RUN and pending_commit:
            conn = flush(conn)

    except KeyboardInterrupt:
        print("\n\nInterrompido pelo utilizador (Ctrl+C).")
        if not DRY_RUN and pending_commit:
            print("A guardar progresso pendente antes de sair...")
            try:
                conn = flush(conn)
                print("Progresso guardado com sucesso.")
            except Exception as e:
                print(f"AVISO: não foi possível guardar o progresso pendente: {e}")
    finally:
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
