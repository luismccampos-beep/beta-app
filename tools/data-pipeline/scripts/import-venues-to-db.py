"""
Import unified venues → destination_venues, matched to cities by proximity.

  python scripts/import-venues-to-db.py
  python scripts/import-venues-to-db.py --limit 1000
"""
import json, time
import pandas as pd

DB = {"host": "localhost", "port": 5432, "dbname": "akmleva", "user": "postgres", "password": "postgres"}
PARQUET = r"C:\Users\luism\Documents\beta-app\Database\restaurants\unified_venues\unified_venues.parquet"
BATCH = 2000

import argparse
ap = argparse.ArgumentParser()
ap.add_argument("--limit", type=int, default=None)
args = ap.parse_args()


def main():
    t0 = time.time()
    import psycopg2

    conn = psycopg2.connect(**DB)
    cur = conn.cursor()

    # Load already-imported venue_ids
    cur.execute("SELECT venue_id FROM destination_venues")
    imported = {r[0] for r in cur.fetchall()}
    print(f"  Already imported: {len(imported):,}")

    # Load parquet
    print("Loading parquet...")
    df = pd.read_parquet(PARQUET)
    df = df[~df['venue_id'].isin(imported)]
    if args.limit:
        df = df.head(args.limit)
    print(f"  {len(df):,} new venues to import")

    # Load cities for spatial matching
    print("Loading cities...")
    cur.execute("SELECT id, latitude, longitude FROM cities")
    cities = cur.fetchall()
    print(f"  {len(cities):,} cities")

    # Build spatial grid
    grid = {}
    for cid, clat, clng in cities:
        bucket = (int(clat), int(clng))
        if bucket not in grid:
            grid[bucket] = []
        grid[bucket].append((cid, clat, clng))

    # Match venues to cities
    print("Matching venues to cities...")
    import math

    def haversine(lat1, lon1, lat2, lon2):
        R = 6371
        dlat, dlon = math.radians(lat2-lat1), math.radians(lon2-lon1)
        a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1))*math.cos(math.radians(lat2))*math.sin(dlon/2)**2
        return R * 2 * math.asin(math.sqrt(a))

    matched = 0
    batch = []

    for _, row in df.iterrows():
        vlat, vlng = row['latitude'], row['longitude']
        if pd.isna(vlat) or pd.isna(vlng):
            continue

        best_dist, best_city = 100, None
        for dlat in (-1, 0, 1):
            for dlng in (-1, 0, 1):
                for cid, clat, clng in grid.get((int(vlat)+dlat, int(vlng)+dlng), []):
                    dist = haversine(vlat, vlng, clat, clng)
                    if dist < best_dist:
                        best_dist, best_city = dist, cid

        if not best_city or best_dist > 50:
            continue

        batch.append((
            0,  # destino_id placeholder
            str(row.get('venue_id', ''))[:32],
            best_city,
            str(row.get('source', ''))[:20],
            str(row.get('name', ''))[:255],
            str(row.get('address', ''))[:5000] if pd.notna(row.get('address')) else None,
            str(row.get('city', ''))[:200],
            str(row.get('country', ''))[:120],
            float(vlat),
            float(vlng),
            str(row.get('cuisine', ''))[:500] if pd.notna(row.get('cuisine')) else None,
            int(row['price_range']) if pd.notna(row.get('price_range')) else None,
            float(row.get('rating', 0)) if pd.notna(row.get('rating')) else 0,
            int(row.get('review_count', 0)) if pd.notna(row.get('review_count')) else 0,
            str(row.get('award', ''))[:50] if pd.notna(row.get('award')) else None,
            str(row.get('phone', ''))[:50] if pd.notna(row.get('phone')) else None,
            str(row.get('website', ''))[:500] if pd.notna(row.get('website')) else None,
            str(row.get('url', ''))[:500] if pd.notna(row.get('url')) else None,
        ))
        matched += 1

        if len(batch) >= BATCH:
            _flush(cur, batch)
            conn.commit()
            batch = []
            if matched % 10000 == 0:
                print(f"  {matched:,} matched...")

    if batch:
        _flush(cur, batch)
        conn.commit()

    cur.close(); conn.close()
    print(f"\nMatched: {matched:,} venues")
    print(f"Done in {time.time()-t0:.1f}s")


def _flush(cur, batch):
    args_str = ",".join(cur.mogrify(
        "(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)", r
    ).decode() for r in batch)
    cur.execute(f"""
        INSERT INTO destination_venues
            (destino_id, venue_id, city_id, source, name, address, city, country,
             latitude, longitude, cuisine, price_range, rating, review_count,
             award, phone, website, url)
        VALUES {args_str}
        ON CONFLICT (destino_id, venue_id) DO UPDATE SET
            city_id = EXCLUDED.city_id, rating = EXCLUDED.rating,
            review_count = EXCLUDED.review_count
    """)


if __name__ == "__main__":
    main()
