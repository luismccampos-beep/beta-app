"""
Fetch climate data incrementally — appends to JSONL after each batch.

  python scripts/fetch-climate-batch.py

Fetches cities with venues but without climate data.
"""
import json, time, random, os
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.request import urlopen, Request

DB = {"host": "localhost", "port": 5432, "dbname": "akmleva", "user": "postgres", "password": "postgres"}
YEAR = 2023
DAILY_VARS = "temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_mean"
TMP = os.path.join(os.environ.get("TEMP", "/tmp"), "climate_batch.jsonl")
BATCH_SIZE = 200


def fetch_one(clat, clng, city_id):
    time.sleep(random.uniform(0.5, 1.2))
    url = (
        f"https://archive-api.open-meteo.com/v1/archive"
        f"?latitude={clat}&longitude={clng}"
        f"&start_date={YEAR}-01-01&end_date={YEAR}-12-31"
        f"&daily={DAILY_VARS}&timezone=auto"
    )
    for attempt in range(3):
        try:
            req = Request(url, headers={"User-Agent": "AKMLEVA/1.0"})
            resp = urlopen(req, timeout=12)
            data = json.loads(resp.read())
            daily = data.get("daily", {})
            if not daily or not daily.get("time"):
                return None
            times = daily["time"]
            tmax = daily.get("temperature_2m_max", [])
            tmin = daily.get("temperature_2m_min", [])
            precip = daily.get("precipitation_sum", [])
            humidity = daily.get("relative_humidity_2m_mean", [])
            monthly = []
            idx = 0
            for m in range(1, 13):
                ts = tn = ps = hs = 0.0; n = 0
                prefix = f"{YEAR}-{m:02d}-"
                while idx < len(times) and times[idx].startswith(prefix):
                    if tmax[idx] is not None: ts += tmax[idx]
                    if tmin[idx] is not None: tn += tmin[idx]
                    if precip[idx] is not None: ps += precip[idx]
                    if humidity[idx] is not None: hs += humidity[idx]; n += 1
                    idx += 1
                if n > 0:
                    monthly.append([m, round(ts/n,1), round(tn/n,1),
                                    round((ts+tn)/(2*n),1), round(ps,1), round(hs/n,1)])
            return monthly
        except Exception as e:
            if "429" in str(e) or "Hourly" in str(e):
                return None  # Rate limited, skip
            if attempt < 2: time.sleep(2 + attempt * 2)
    return None


def main():
    import psycopg2
    t0 = time.time()

    conn = psycopg2.connect(**DB)
    cur = conn.cursor()

    cur.execute("SELECT DISTINCT city_id FROM city_monthly_metrics WHERE source='open-meteo-archive'")
    done_ids = {r[0] for r in cur.fetchall()}
    print(f"Already done: {len(done_ids)} cities")

    cur.execute("""
        SELECT DISTINCT ci.id, ci.latitude, ci.longitude
        FROM cities ci
        JOIN destination_venues dv ON dv.city_id = ci.id
        WHERE ci.id NOT IN %s AND ci.latitude IS NOT NULL AND ci.longitude IS NOT NULL
    """, (tuple(done_ids) if done_ids else ('__none__',),))
    cities = cur.fetchall()
    cur.close(); conn.close()

    print(f"Remaining: {len(cities)} cities")
    if not cities:
        print("Nothing to do!"); return

    total_inserted = 0
    batch_num = 0

    while cities:
        batch = cities[:BATCH_SIZE]
        cities = cities[BATCH_SIZE:]
        batch_num += 1
        print(f"\n--- Batch {batch_num} ({len(batch)} cities, {len(cities)} remaining) ---")

        rows = []
        errors = 0
        with ThreadPoolExecutor(max_workers=2) as pool:
            futs = {pool.submit(fetch_one, lat, lng, cid): cid for cid, lat, lng in batch}
            done_n = 0
            for f in as_completed(futs):
                r = f.result()
                cid = futs[f]
                done_n += 1
                if r:
                    for row in r:
                        rows.append([cid] + row)
                else:
                    errors += 1
                if done_n % 50 == 0:
                    print(f"  {done_n}/{len(batch)} ({errors} err)")

        # Write to temp file (append)
        with open(TMP, "a") as fout:
            for row in rows:
                fout.write(json.dumps(row) + "\n")

        # Insert directly into DB
        if rows:
            metric_rows = []
            for parts in rows:
                cid = parts[0]
                for metric, val in [("temp_max",parts[2]),("temp_min",parts[3]),("temp_avg",parts[4]),
                                    ("precip_total",parts[5]),("humidity_avg",parts[6])]:
                    metric_rows.append((cid, parts[1], "climate", metric, val, "open-meteo-archive"))

            conn2 = psycopg2.connect(**DB)
            cur2 = conn2.cursor()
            BS = 5000
            for i in range(0, len(metric_rows), BS):
                chunk = metric_rows[i:i+BS]
                vals = ",".join(cur2.mogrify("(%s,%s,%s,%s,%s,%s)", r).decode() for r in chunk)
                cur2.execute(f"""
                    INSERT INTO city_monthly_metrics (city_id,month,domain,metric,value,source)
                    VALUES {vals}
                    ON CONFLICT (city_id,month,domain,metric)
                    DO UPDATE SET value=EXCLUDED.value, source=EXCLUDED.source, computed_at=now()
                """)
            conn2.commit()
            cur2.close(); conn2.close()
            total_inserted += len(rows)

        elapsed = time.time()-t0
        print(f"  Inserted {len(rows)} city-months ({errors} errors). Total: {total_inserted}. Elapsed: {elapsed:.0f}s")

        # Rate limit pause between batches
        if cities:
            print("  Pausing 5s for rate limit...")
            time.sleep(5)

    print(f"\nDone in {time.time()-t0:.1f}s — {total_inserted} city-months inserted")


if __name__ == "__main__":
    main()
