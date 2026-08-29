"""
DEPRECATED: Use fetch-identity.mjs instead (Node.js version).

The Node.js version adds:
- Idempotent upserts by geonamesId (not just insert)
- Admin1/2 human-readable names (join against admin code files)
- Data validation (coordinates, population, timezone)
- Checkpoint/resume support
- Structured JSON logging for CI/CD
- Enriched Wikidata data (driving side, calling code, coordinates)
- Configurable priority cities list

Migration:
  python scripts/fetch-identity.py          →  node scripts/fetch-identity.mjs
  python scripts/fetch-identity.py --limit 1000  →  node scripts/fetch-identity.mjs --limit 1000
  python scripts/fetch-identity.py --force       →  node scripts/fetch-identity.mjs --force
"""
import json, os, sys, time, zipfile
from io import BytesIO
from pathlib import Path
from urllib.request import urlopen, Request
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent.parent.parent
DATA_DIR = ROOT / "tools" / "data-pipeline" / "data" / "identity"
GEONAMES_URL = "https://download.geonames.org/export/dump/cities5000.zip"
GEONAMES_ZIP = DATA_DIR / "cities5000.zip"
GEONAMES_TSV = DATA_DIR / "cities5000.txt"

DB = {"host": "localhost", "port": 5432, "dbname": "akmleva", "user": "postgres", "password": "postgres"}

COASTAL_FEATURES = {"RK", "RCH", "BNK", "BCH", "CST", "SHOR"}
ISLAND_FEATURES = {"ISL"}

WIKIDATA_CONTINENT_MAP = {
    "Q46": "Europe", "Q48": "Asia", "Q15": "Africa", "Q49": "North America",
    "Q132": "South America", "Q538": "Oceania", "Q51": "Antarctica",
    "Q18": "South America", "Q39": "South America", "Q60": "Europe",
    "Q55643": "South America",
}

LIMIT = Infinity = float("inf")
FORCE = False


def _trunc(val, maxlen):
    if val is None:
        return None
    s = str(val)
    return s[:maxlen] if len(s) > maxlen else s

import argparse
ap = argparse.ArgumentParser()
ap.add_argument("--limit", type=int, default=None)
ap.add_argument("--force", action="store_true")
args = ap.parse_args()
if args.limit: LIMIT = args.limit
FORCE = args.force


def download_geonames():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if GEONAMES_TSV.exists() and not FORCE:
        print(f"GeoNames TSV exists: {GEONAMES_TSV}")
        return
    if not GEONAMES_ZIP.exists() or FORCE:
        print(f"Downloading {GEONAMES_URL}...")
        resp = urlopen(GEONAMES_URL, timeout=60)
        data = resp.read()
        GEONAMES_ZIP.write_bytes(data)
        print(f"  Downloaded {len(data)/1024/1024:.1f} MB")
    print("Extracting...")
    with zipfile.ZipFile(GEONAMES_ZIP) as zf:
        names = zf.namelist()
        txt = [n for n in names if n.endswith(".txt")]
        if txt:
            with zf.open(txt[0]) as src, open(GEONAMES_TSV, "wb") as dst:
                dst.write(src.read())
    print(f"  Extracted to {GEONAMES_TSV}")


def fetch_wikidata_countries():
    print("Fetching country metadata from Wikidata SPARQL...")
    query = """
    SELECT ?iso2 ?iso3 ?name ?population ?area ?continent ?capital
           ?currency ?currencySymbol ?drivingSide ?callingCode ?plugType
           ?latitude ?longitude ?wikidataId
    WHERE {
      ?country wdt:P31 wd:Q6256 .
      ?country wdt:P297 ?iso2 .
      OPTIONAL { ?country wdt:P298 ?iso3 . }
      OPTIONAL { ?country wdt:P36 ?capital . ?capital rdfs:label ?capName . FILTER(LANG(?capName)='en') }
      OPTIONAL { ?country rdfs:label ?name . FILTER(LANG(?name)='en') }
      OPTIONAL { ?country wdt:P1082 ?population . }
      OPTIONAL { ?country wdt:P2046 ?area . }
      OPTIONAL { ?country wdt:P30 ?continent . }
      OPTIONAL { ?country wdt:P38 ?currency . ?currency rdfs:label ?curName . FILTER(LANG(?curName)='en') }
      OPTIONAL { ?country wdt:P38 ?currency . ?currency wdt:P1813 ?sym . FILTER(LANG(?sym)='en') }
      OPTIONAL { ?country wdt:P1819 ?drivingSide . }
      OPTIONAL { ?country wdt:P473 ?callingCode . }
      OPTIONAL { ?country wdt:P3075 ?plugType . }
      OPTIONAL { ?country wdt:P625 ?coord . BIND(geof:latitude(?coord) AS ?latitude) BIND(geof:longitude(?coord) AS ?longitude) }
      BIND(REPLACE(STR(?country),'.*Q','') AS ?wikidataId)
    }
    """
    url = f"https://query.wikidata.org/sparql?query={quote(query)}&format=json"
    try:
        req = Request(url, headers={"User-Agent": "AKMLEVA-TravelIntel/1.0"})
        resp = urlopen(req, timeout=30)
        data = json.loads(resp.read())
        results = {}
        for b in data["results"]["bindings"]:
            iso2 = b.get("iso2", {}).get("value")
            if not iso2 or len(iso2) != 2:
                continue
            results[iso2] = {
                "iso3": b.get("iso3", {}).get("value"),
                "name": b.get("name", {}).get("value"),
                "population": int(b["population"]["value"]) if "population" in b else None,
                "area": float(b["area"]["value"]) if "area" in b else None,
                "continent": WIKIDATA_CONTINENT_MAP.get(
                    b.get("continent", {}).get("value", "").split("/")[-1], ""
                ) or b.get("continent", {}).get("value", "").split("/")[-1],
                "capital": b.get("capital", {}).get("value"),
                "currency": b.get("currency", {}).get("value", "").split("/")[-1],
                "currencySymbol": b.get("currencySymbol", {}).get("value"),
                "drivingSide": b.get("drivingSide", {}).get("value"),
                "callingCode": b.get("callingCode", {}).get("value"),
                "plugType": b.get("plugType", {}).get("value", "").split("/")[-1],
                "latitude": float(b["latitude"]["value"]) if "latitude" in b else None,
                "longitude": float(b["longitude"]["value"]) if "longitude" in b else None,
                "wikidataId": b.get("wikidataId", {}).get("value"),
            }
        print(f"  {len(results)} countries loaded")
        return results
    except Exception as e:
        print(f"  Wikidata failed: {e}. Using fallback.")
        return {}


def parse_geonames():
    print("Parsing GeoNames TSV...")
    cities = []
    with open(GEONAMES_TSV, "r", encoding="utf-8") as f:
        for line in f:
            cols = line.strip().split("\t")
            if len(cols) < 19:
                continue
            geonameid, name, asciiname, alt, lat, lng, fclass, fcode = cols[:8]
            country_code = cols[8]
            admin1 = cols[10]
            population = int(cols[14]) if cols[14] else 0
            elevation = float(cols[15]) if cols[15] else None
            timezone = cols[17]

            if not country_code or len(country_code) != 2:
                continue

            cities.append({
                "geonamesId": int(geonameid),
                "name": name.strip()[:200],
                "nameEn": asciiname.strip()[:200],
                "latitude": float(lat),
                "longitude": float(lng),
                "featureClass": fclass,
                "featureCode": fcode,
                "countryCode": country_code.strip(),
                "admin1": admin1.strip() if admin1 else None,
                "population": population,
                "elevation": elevation,
                "timezone": timezone.strip() if timezone else None,
            })

    print(f"  {len(cities):,} cities parsed")
    return cities


def main():
    t0 = time.time()

    download_geonames()
    countries_meta = fetch_wikidata_countries()
    cities = parse_geonames()

    if LIMIT < Infinity:
        cities = cities[:int(LIMIT)]
        print(f"  Limited to {LIMIT}")

    # Group by country
    by_country = {}
    for c in cities:
        cc = c["countryCode"]
        if cc not in by_country:
            by_country[cc] = []
        by_country[cc].append(c)
    print(f"  {len(by_country)} countries represented")

    import psycopg2
    conn = psycopg2.connect(**DB)
    cur = conn.cursor()

    # Upsert countries
    print("\nUpserting countries...")
    for iso2, cities_in_country in by_country.items():
        meta = countries_meta.get(iso2, {})
        population = meta.get("population") or max((c["population"] for c in cities_in_country), default=0)
        lat = meta.get("latitude") or cities_in_country[0]["latitude"]
        lng = meta.get("longitude") or cities_in_country[0]["longitude"]

        # Map Wikidata driving side Q-number → string
        ds_raw = meta.get("drivingSide") or ""
        if "Q1868517" in ds_raw:
            driving_side = "left"
        elif "Q2070508" in ds_raw:
            driving_side = "right"
        else:
            driving_side = ds_raw if ds_raw in ("left", "right") else "right"

        # plugType is a Q-number, store as JSON array
        plug_type = meta.get("plugType")
        plug_types = json.dumps([plug_type]) if plug_type else None

        # Currency from Wikidata is a Q-number, not ISO 4217 code — skip for now
        currency_code = None
        currency_sym = None

        cur.execute("""
            INSERT INTO countries (iso2, iso3, name, name_en, wikidata_id,
                continent, latitude, longitude, area, population, capital_city,
                currency, currency_symbol, plug_types, driving_side, calling_code, emergency_number)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            ON CONFLICT (iso2) DO UPDATE SET
                name = EXCLUDED.name, population = EXCLUDED.population,
                area = EXCLUDED.area, latitude = EXCLUDED.latitude, longitude = EXCLUDED.longitude,
                updated_at = now()
        """, (
            iso2,
            _trunc(meta.get("iso3"), 3),
            _trunc(meta.get("name") or iso2, 120),
            _trunc(meta.get("name"), 120),
            _trunc(meta.get("wikidataId"), 16),
            _trunc(meta.get("continent"), 20),
            lat, lng,
            meta.get("area"),
            population,
            _trunc(meta.get("capital"), 120),
            currency_code,
            currency_sym,
            plug_types,
            driving_side,
            _trunc(f"+{meta['callingCode']}" if meta.get("callingCode") else None, 8),
            None,
        ))
    conn.commit()
    print(f"  {len(by_country)} countries upserted")

    # Country ID map
    cur.execute("SELECT id, iso2 FROM countries")
    country_id_map = {iso2: id_ for id_, iso2 in cur.fetchall()}

    # Upsert cities
    print("Upserting cities...")
    city_count = 0
    batch = []
    BATCH_SIZE = 200

    for c in cities:
        country_id = country_id_map.get(c["countryCode"])
        if not country_id:
            continue

        slug_base = c["nameEn"].lower()
        slug_base = "".join(ch if ch.isalnum() or ch == "-" else "-" for ch in slug_base)
        slug_base = "-".join(p for p in slug_base.split("-") if p)[:50]
        slug = f"{slug_base}-{c['countryCode'].lower()}"

        flags = {
            "is_coastal": c["featureCode"] in COASTAL_FEATURES,
            "is_island": c["featureCode"] in ISLAND_FEATURES,
            "is_capital": c["featureCode"] == "PPLC",
        }

        batch.append((
            country_id, slug, c["geonamesId"],
            c["name"], c["nameEn"],
            c["admin1"], c["timezone"], c["elevation"],
            c["latitude"], c["longitude"],
            c["population"], flags["is_coastal"], flags["is_island"], flags["is_capital"],
        ))

        if len(batch) >= BATCH_SIZE:
            _flush_cities(cur, batch)
            conn.commit()
            city_count += len(batch)
            batch = []

    if batch:
        _flush_cities(cur, batch)
        conn.commit()
        city_count += len(batch)

    cur.close()
    conn.close()

    print(f"  {city_count:,} cities upserted")
    print(f"\nDone in {time.time()-t0:.1f}s")

    # Summary
    conn = psycopg2.connect(**DB)
    cur = conn.cursor()
    cur.execute("SELECT count(*) FROM countries")
    print(f"\nCountries: {cur.fetchone()[0]}")
    cur.execute("SELECT count(*) FROM cities")
    print(f"Cities: {cur.fetchone()[0]:,}")
    cur.execute("""
        SELECT c.continent, count(*)
        FROM cities ci JOIN countries c ON c.id = ci.country_id
        WHERE c.continent IS NOT NULL
        GROUP BY c.continent ORDER BY 2 DESC
    """)
    print("By continent:")
    for cont, cnt in cur.fetchall():
        print(f"  {cont}: {cnt:,}")
    cur.close()
    conn.close()


def _flush_cities(cur, batch):
    for (country_id, slug, geonames_id, name, name_en,
         admin1, timezone, elevation, lat, lng,
         population, is_coastal, is_island, is_capital) in batch:
        cur.execute("""
            INSERT INTO cities (country_id, slug, geonames_id, name, name_en,
                region, timezone, elevation, latitude, longitude,
                population, is_coastal, is_island, is_capital)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            ON CONFLICT (slug) DO UPDATE SET
                population = GREATEST(cities.population, EXCLUDED.population),
                elevation = COALESCE(cities.elevation, EXCLUDED.elevation),
                updated_at = now()
        """, (country_id, slug, geonames_id, name, name_en,
              admin1, timezone, elevation, lat, lng,
              population, is_coastal, is_island, is_capital))


if __name__ == "__main__":
    main()
