"""
Derive monthly crowd scores for cities with venue data.

Writes: city_monthly_metrics domain='crowd', metric='tourist_density' (0-100)
"""
import math, time, io, csv

DB = {"host": "localhost", "port": 5432, "dbname": "akmleva", "user": "postgres", "password": "postgres"}
NORTHERN_MODS = {1: 0.6, 2: 0.6, 3: 0.7, 4: 0.85, 5: 1.0,
                 6: 1.15, 7: 1.25, 8: 1.2, 9: 1.0, 10: 0.85, 11: 0.7, 12: 0.6}


def main():
    t0 = time.time()
    import psycopg2
    conn = psycopg2.connect(**DB)
    cur = conn.cursor()

    print("Loading venue cities + stats...")
    cur.execute("""
        SELECT ci.id, ci.population, ci.density, ci.is_capital,
               cm.cost_of_living_score,
               count(dv.id) as venue_count,
               count(dv.award) FILTER (WHERE dv.award IS NOT NULL) as award_count
        FROM cities ci
        JOIN destination_venues dv ON dv.city_id = ci.id
        LEFT JOIN city_metrics cm ON cm.city_id = ci.id
        GROUP BY ci.id, ci.population, ci.density, ci.is_capital, cm.cost_of_living_score
    """)
    cols = ["id", "population", "density", "is_capital", "col", "venue_count", "award_count"]
    cities = [dict(zip(cols, row)) for row in cur.fetchall()]
    print(f"  {len(cities):,} cities with venues")

    print("Loading monthly climate...")
    cur.execute("""
        SELECT city_id, month, value FROM city_monthly_metrics
        WHERE domain = 'climate' AND metric = 'temp_avg'
    """)
    monthly_temp = {}
    for cid, month, val in cur.fetchall():
        monthly_temp.setdefault(cid, {})[month] = val
    print(f"  {sum(len(v) for v in monthly_temp.values())} data points")

    print("Computing...")
    all_rows = []

    for city in cities:
        cid = city["id"]
        venue_score = min(50, 10 + 15 * math.log10(max(city["venue_count"], 1)))
        award_score = min(20, city["award_count"] * 5)
        pop_score = 0
        if city["density"]:
            if city["density"] > 5000: pop_score = 15
            elif city["density"] > 2000: pop_score = 10
            elif city["density"] > 500: pop_score = 5
            else: pop_score = 2
        cap_score = 10 if city["is_capital"] else 0
        static = min(70, venue_score + award_score + pop_score + cap_score)

        temps = monthly_temp.get(cid, {})
        has_climate = bool(temps)

        for m in range(1, 13):
            if has_climate and temps.get(m) is not None:
                temp = temps[m]
                if 18 <= temp <= 28:
                    climate_mod = 1.0 + (28 - abs(temp - 23)) / 28 * 0.3
                elif temp > 28:
                    climate_mod = max(0.6, 1.0 - (temp - 28) / 30)
                else:
                    climate_mod = max(0.5, 0.6 + temp / 25 * 0.4)
            else:
                climate_mod = NORTHERN_MODS[m]

            score = min(100, int(round(static * climate_mod)))
            all_rows.append((cid, m, "crowd", "tourist_density", float(score), "derived"))

    print(f"  {len(all_rows):,} rows in {time.time()-t0:.1f}s")

    print("Writing via COPY...")
    cur.execute("DELETE FROM city_monthly_metrics WHERE domain='crowd' AND metric='tourist_density'")
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
        SELECT count(*), round(avg(value)::numeric,1), min(value), max(value)
        FROM city_monthly_metrics WHERE domain='crowd' AND metric='tourist_density'
    """)
    r = cur2.fetchone()
    print(f"  crowd/tourist_density: count={r[0]:,}  avg={r[1]}  min={r[2]}  max={r[3]}")
    cur2.close(); conn2.close()


if __name__ == "__main__":
    main()
