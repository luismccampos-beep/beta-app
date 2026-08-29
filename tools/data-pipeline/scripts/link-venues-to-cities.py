"""
Match destination_venues → cities by haversine proximity (≤50km).

  python scripts/link-venues-to-cities.py
"""
import math
import time

DB = {"host": "localhost", "port": 5432, "dbname": "akmleva", "user": "postgres", "password": "postgres"}
MAX_KM = 50

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    return R * 2 * math.asin(math.sqrt(a))

def main():
    t0 = time.time()
    import psycopg2
    conn = psycopg2.connect(**DB)
    cur = conn.cursor()

    # Load all cities
    print("Loading cities...")
    cur.execute("SELECT id, latitude, longitude, name FROM cities")
    cities = cur.fetchall()
    print(f"  {len(cities):,} cities loaded")

    # Build spatial grid (1-degree buckets for fast coarse filtering)
    grid = {}
    for cid, lat, lng, name in cities:
        bucket = (int(lat), int(lng))
        if bucket not in grid:
            grid[bucket] = []
        grid[bucket].append((cid, lat, lng))

    # Load unmatched venues
    print("Loading venues without city_id...")
    cur.execute("SELECT id, latitude, longitude, name FROM destination_venues WHERE city_id IS NULL")
    venues = cur.fetchall()
    print(f"  {len(venues):,} venues to match")

    matched = 0
    unmatched = 0
    batch = []
    BATCH = 500

    for vid, vlat, vlng, vname in venues:
        best_dist = MAX_KM + 1
        best_city = None

        # Check 3x3 grid neighborhood
        for dlat in (-1, 0, 1):
            for dlng in (-1, 0, 1):
                bucket = (int(vlat) + dlat, int(vlng) + dlng)
                for cid, clat, clng in grid.get(bucket, []):
                    dist = haversine(vlat, vlng, clat, clng)
                    if dist < best_dist:
                        best_dist = dist
                        best_city = cid

        if best_city and best_dist <= MAX_KM:
            batch.append((best_city, vid))
            matched += 1
        else:
            unmatched += 1

        if len(batch) >= BATCH:
            _flush(cur, batch)
            conn.commit()
            batch = []

    if batch:
        _flush(cur, batch)
        conn.commit()

    cur.close()
    conn.close()

    print(f"\nMatched: {matched:,} / {len(venues):,} ({matched*100/max(len(venues),1):.1f}%)")
    print(f"Unmatched: {unmatched:,}")
    print(f"Done in {time.time()-t0:.1f}s")

    # Summary
    conn = psycopg2.connect(**DB)
    cur = conn.cursor()
    cur.execute("""
        SELECT c.name, count(*) as cnt
        FROM destination_venues dv
        JOIN cities c ON c.id = dv.city_id
        GROUP BY c.name ORDER BY cnt DESC LIMIT 20
    """)
    print("\nTop 20 cities by venue count:")
    for name, cnt in cur.fetchall():
        print(f"  {name}: {cnt:,}")
    cur.close()
    conn.close()

def _flush(cur, batch):
    for city_id, venue_id in batch:
        cur.execute("UPDATE destination_venues SET city_id = %s WHERE id = %s", (city_id, venue_id))

if __name__ == "__main__":
    main()
