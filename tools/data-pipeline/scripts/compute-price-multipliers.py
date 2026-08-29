"""
Derive monthly price multipliers for cities with venue data.

Writes: city_monthly_metrics domain='price', metric='demand_multiplier' (0.5-2.0)
"""
import time, io, csv

DB = {"host": "localhost", "port": 5432, "dbname": "akmleva", "user": "postgres", "password": "postgres"}
NORTHERN_BASE = {1: 0.75, 2: 0.75, 3: 0.85, 4: 0.95, 5: 1.05,
                 6: 1.25, 7: 1.40, 8: 1.35, 9: 1.10, 10: 0.95, 11: 0.80, 12: 0.75}


def main():
    t0 = time.time()
    import psycopg2
    conn = psycopg2.connect(**DB)
    cur = conn.cursor()

    print("Loading venue cities...")
    cur.execute("""
        SELECT ci.id, ci.is_capital,
               cm.cost_of_living_score,
               count(dv.id) as venue_count
        FROM cities ci
        JOIN destination_venues dv ON dv.city_id = ci.id
        LEFT JOIN city_metrics cm ON cm.city_id = ci.id
        GROUP BY ci.id, ci.is_capital, cm.cost_of_living_score
    """)
    cities = {}
    for row in cur.fetchall():
        cid, is_cap, col, vc = row
        tier = 1.0
        if vc > 100: tier = 1.3
        elif vc > 20: tier = 1.15
        elif vc > 5: tier = 1.05
        if is_cap: tier *= 0.9
        if col and col > 75: tier *= 0.85
        cities[cid] = tier
    print(f"  {len(cities):,} cities")

    print("Loading monthly climate...")
    cur.execute("""
        SELECT city_id, month, value FROM city_monthly_metrics
        WHERE domain = 'climate' AND metric = 'temp_avg'
    """)
    monthly_temp = {}
    for cid, month, val in cur.fetchall():
        monthly_temp.setdefault(cid, {})[month] = val

    print("Computing...")
    all_rows = []

    for cid, tier in cities.items():
        temps = monthly_temp.get(cid, {})
        has_climate = bool(temps)

        for m in range(1, 13):
            if has_climate and temps.get(m) is not None:
                temp = temps[m]
                if 20 <= temp <= 26:
                    demand = 1.0 + 0.4 * tier * (1 - abs(temp - 23) / 6)
                elif temp > 26:
                    demand = max(0.7, 1.0 - (temp - 26) / 40)
                else:
                    demand = max(0.6, 0.7 + (temp - (-5)) / 25 * 0.3)
            else:
                demand = NORTHERN_BASE[m] * tier

            demand = max(0.5, min(2.0, round(demand, 3)))
            all_rows.append((cid, m, "price", "demand_multiplier", demand, "derived"))

    print(f"  {len(all_rows):,} rows in {time.time()-t0:.1f}s")

    print("Writing via COPY...")
    cur.execute("DELETE FROM city_monthly_metrics WHERE domain='price' AND metric='demand_multiplier'")
    conn.commit()

    buf = io.StringIO()
    writer = csv.writer(buf, delimiter='\t')
    for row in all_rows:
        writer.writerow(row)
    buf.seek(0)
    cur.copy_from(buf, 'city_monthly_metrics', columns=('city_id','month','domain','metric','value','source'))
    conn.commit()

    cur.close(); conn.close()

    elapsed = time.time()-t0
    print(f"Done in {elapsed:.1f}s")
    conn2 = psycopg2.connect(**DB)
    cur2 = conn2.cursor()
    cur2.execute("""
        SELECT count(*), round(avg(value)::numeric,3), min(value), max(value)
        FROM city_monthly_metrics WHERE domain='price' AND metric='demand_multiplier'
    """)
    r = cur2.fetchone()
    print(f"  price/demand_multiplier: count={r[0]:,}  avg={r[1]}  min={r[2]}  max={r[3]}")
    cur2.close(); conn2.close()


if __name__ == "__main__":
    main()
