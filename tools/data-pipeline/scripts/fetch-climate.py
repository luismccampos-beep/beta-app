"""
Fetch climate data from Open-Meteo → temp file → city_monthly_metrics.

Phase 1: Fetch from API → save to JSONL
Phase 2: Insert from JSONL → DB

  python scripts/fetch-climate.py --fetch --limit 100
  python scripts/fetch-climate.py --insert
"""
import json, time, random, os, sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.request import urlopen, Request

DB = {"host": "localhost", "port": 5432, "dbname": "akmleva", "user": "postgres", "password": "postgres"}
YEAR = 2023
DAILY_VARS = "temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_mean"
TMP = os.path.join(os.environ.get("TEMP", "/tmp"), "climate_data.jsonl")

import argparse
ap = argparse.ArgumentParser()
ap.add_argument("--fetch", action="store_true", help="Fetch from API")
ap.add_argument("--insert", action="store_true", help="Insert from temp file")
ap.add_argument("--limit", type=int, default=None)
ap.add_argument("--workers", type=int, default=4)
args = ap.parse_args()


def fetch_one(clat, clng, city_id):
    time.sleep(random.uniform(0.3, 0.8))
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
            times, tmax, tmin, precip, humidity = (
                daily["time"], daily.get("temperature_2m_max", []),
                daily.get("temperature_2m_min", []),
                daily.get("precipitation_sum", []),
                daily.get("relative_humidity_2m_mean", []),
            )
            monthly = []
            idx = 0
            for m in range(12):
                ts = tn = ps = hs = 0.0; n = 0
                prefix = f"{YEAR}-{m+1:02d}-"
                while idx < len(times) and times[idx].startswith(prefix):
                    if tmax[idx] is not None: ts += tmax[idx]
                    if tmin[idx] is not None: tn += tmin[idx]
                    if precip[idx] is not None: ps += precip[idx]
                    if humidity[idx] is not None: hs += humidity[idx]; n += 1
                    idx += 1
                if n > 0:
                    monthly.append([m+1, round(ts/n,1), round(tn/n,1),
                                    round((ts+tn)/(2*n),1), round(ps,1), round(hs/n,1)])
            return monthly
        except Exception:
            if attempt < 2: time.sleep(1 + attempt)
    return None


def do_fetch():
    import psycopg2
    t0 = time.time()
    conn = psycopg2.connect(**DB)
    cur = conn.cursor()

    cur.execute("SELECT DISTINCT city_id FROM city_monthly_metrics WHERE source='open-meteo-archive'")
    done_ids = {r[0] for r in cur.fetchall()}
    print(f"Already done: {len(done_ids)} cities")

    cur.execute("""
        SELECT DISTINCT ci.id, ci.latitude, ci.longitude
        FROM cities ci JOIN destination_venues dv ON dv.city_id = ci.id
        WHERE ci.id NOT IN %s
    """, (tuple(done_ids) if done_ids else ('__none__',),))
    cities = cur.fetchall()
    cur.close(); conn.close()
    print(f"Remaining: {len(cities)} cities")

    if args.limit:
        cities = cities[:args.limit]
    if not cities:
        print("Nothing to do!"); return

    print(f"Fetching with {args.workers} workers...")
    done_n = 0; errors = 0

    with open(TMP, "w") as fout:
        with ThreadPoolExecutor(max_workers=args.workers) as pool:
            futs = {pool.submit(fetch_one, lat, lng, cid): cid for cid, lat, lng in cities}
            for f in as_completed(futs):
                r = f.result()
                cid = futs[f]
                done_n += 1
                if r:
                    for row in r:
                        fout.write(json.dumps([cid] + row) + "\n")
                else:
                    errors += 1
                if done_n % 50 == 0:
                    el = time.time()-t0
                    rate = done_n/el if el > 0 else 0
                    eta = (len(cities)-done_n)/rate if rate > 0 else 0
                    print(f"  {done_n}/{len(cities)} ({errors} err) {rate:.1f}/s ETA {eta:.0f}s")

    print(f"\nDone in {time.time()-t0:.1f}s — wrote {TMP}")


def do_insert():
    import psycopg2
    t0 = time.time()

    if not os.path.exists(TMP):
        print(f"No temp file: {TMP}"); return

    with open(TMP) as f:
        lines = f.readlines()
    print(f"Read {len(lines)} rows from temp file")

    # Expand to individual metric rows
    metric_rows = []
    for line in lines:
        parts = json.loads(line)
        cid = parts[0]
        m = parts[1]
        for metric, val in [("temp_max",parts[2]),("temp_min",parts[3]),("temp_avg",parts[4]),
                            ("precip_total",parts[5]),("humidity_avg",parts[6])]:
            metric_rows.append((cid, m, "climate", metric, val, "open-meteo-archive"))

    print(f"Inserting {len(metric_rows):,} metric rows...")
    conn = psycopg2.connect(**DB)
    cur = conn.cursor()
    BS = 5000
    for i in range(0, len(metric_rows), BS):
        chunk = metric_rows[i:i+BS]
        vals = ",".join(cur.mogrify("(%s,%s,%s,%s,%s,%s)", r).decode() for r in chunk)
        cur.execute(f"""
            INSERT INTO city_monthly_metrics (city_id,month,domain,metric,value,source)
            VALUES {vals}
            ON CONFLICT (city_id,month,domain,metric)
            DO UPDATE SET value=EXCLUDED.value, source=EXCLUDED.source, computed_at=now()
        """)
        conn.commit()
        if (i // BS) % 10 == 0:
            print(f"  {min(i+BS, len(metric_rows)):,}/{len(metric_rows):,}")

    cur.close(); conn.close()
    print(f"Inserted in {time.time()-t0:.1f}s")


if __name__ == "__main__":
    if args.fetch:
        do_fetch()
    elif args.insert:
        do_insert()
    else:
        print("Use --fetch or --insert")
