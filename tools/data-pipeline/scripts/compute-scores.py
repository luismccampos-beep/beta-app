"""
Compute composite domain scores for all cities from available data.

  python scripts/compute-scores.py

Writes to city_metrics per-field columns: nature_score, culture_score, walkability_score, etc.
"""
import json, math, time

DB = {"host": "localhost", "port": 5432, "dbname": "akmleva", "user": "postgres", "password": "postgres"}


def compute_nature_score(city):
    score = 0.0
    if city["is_coastal"]:
        score += 30
    if city["is_island"]:
        score += 20
    density = city.get("density")
    if density is not None:
        score += max(0, min(40, (10000 - density) / 10000 * 40))
    else:
        score += 20
    elev = city.get("elevation")
    if elev is not None:
        if 200 <= elev <= 1000:
            score += 10
        elif 50 <= elev < 200 or 1000 < elev <= 2000:
            score += 7
        else:
            score += 3
    else:
        score += 5
    return min(100, int(round(score)))


def compute_walkability_score(city):
    """Walkability: high density + coastal/island + moderate population."""
    score = 0.0
    density = city.get("density")
    if density is not None:
        if density > 5000:
            score += 40
        elif density > 2000:
            score += 30
        elif density > 500:
            score += 20
        else:
            score += 10
    pop = city.get("population") or 0
    if 50_000 <= pop <= 2_000_000:
        score += 30
    elif pop > 2_000_000:
        score += 20
    elif pop > 10_000:
        score += 15
    else:
        score += 5
    if city.get("timezone"):
        score += 10
    if city.get("is_capital"):
        score += 15
    if city.get("airport_iata"):
        score += 5
    return min(100, int(round(score)))


def compute_culture_score(venue_stats):
    count = venue_stats.get("count", 0)
    awards = venue_stats.get("awards", 0)
    if count > 0:
        score = min(70, 10 + 20 * math.log10(count))
    else:
        score = 0
    if awards > 0:
        score += min(30, 10 + 10 * math.log10(awards))
    return min(100, int(round(score)))


def compute_climate_comfort(monthly_data):
    if not monthly_data:
        return None
    temps = [r[0] for r in monthly_data if r[0] is not None]
    precips = [r[1] for r in monthly_data if r[1] is not None]
    humids = [r[2] for r in monthly_data if r[2] is not None]
    if not temps:
        return None
    avg_temp = sum(temps) / len(temps)
    temp_range = max(temps) - min(temps)
    avg_precip = sum(precips) / len(precips) if precips else 0
    avg_humid = sum(humids) / len(humids) if humids else 50
    score = 0.0
    score += max(0, 40 - abs(avg_temp - 21) * 4)
    score += max(0, 20 - temp_range)
    if 50 <= avg_precip <= 100:
        score += 20
    elif 30 <= avg_precip < 50 or 100 < avg_precip <= 150:
        score += 12
    else:
        score += 5
    if 40 <= avg_humid <= 70:
        score += 20
    elif 30 <= avg_humid < 40 or 70 < avg_humid <= 80:
        score += 12
    else:
        score += 5
    return min(100, int(round(score)))


def main():
    t0 = time.time()
    import psycopg2
    conn = psycopg2.connect(**DB)
    cur = conn.cursor()

    print("Loading cities...")
    cur.execute("""
        SELECT ci.id, ci.population, ci.elevation, ci.is_coastal, ci.is_island,
               ci.is_capital, ci.airport_iata, ci.timezone, ci.density
        FROM cities ci
    """)
    city_cols = ["id", "population", "elevation", "is_coastal", "is_island",
                 "is_capital", "airport_iata", "timezone", "density"]
    cities = [dict(zip(city_cols, row)) for row in cur.fetchall()]
    print(f"  {len(cities):,} cities")

    print("Loading venue stats...")
    cur.execute("""
        SELECT city_id, count(*) as cnt, count(award) as awards
        FROM destination_venues WHERE city_id IS NOT NULL GROUP BY city_id
    """)
    venue_stats = {r[0]: {"count": r[1], "awards": r[2]} for r in cur.fetchall()}
    print(f"  {len(venue_stats):,} cities with venues")

    print("Loading climate data...")
    cur.execute("""
        SELECT city_id, month, metric, value FROM city_monthly_metrics
        WHERE domain = 'climate' AND source = 'open-meteo-archive'
    """)
    climate_raw = {}
    for cid, month, metric, value in cur.fetchall():
        climate_raw.setdefault(cid, {}).setdefault(month, {})[metric] = value
    climate_monthly = {}
    for cid, months in climate_raw.items():
        climate_monthly[cid] = [
            (months.get(m, {}).get("temp_avg"),
             months.get(m, {}).get("precip_total"),
             months.get(m, {}).get("humidity_avg"))
            for m in range(1, 13)
        ]
    print(f"  {len(climate_monthly):,} cities with climate")

    # Compute nature + walkability for ALL cities, culture for cities with venues
    print("Computing scores...")
    nature_rows = []
    walk_rows = []
    culture_rows = []

    for city in cities:
        cid = city["id"]
        nature_rows.append((cid, compute_nature_score(city)))
        walk_rows.append((cid, compute_walkability_score(city)))
        vs = venue_stats.get(cid, {"count": 0, "awards": 0})
        culture = compute_culture_score(vs)
        if culture > 0:
            culture_rows.append((cid, culture))

    # Climate comfort scores
    climate_rows = []
    for cid, monthly in climate_monthly.items():
        cc = compute_climate_comfort(monthly)
        if cc is not None:
            climate_rows.append((cid, cc))

    print(f"  nature: {len(nature_rows):,}, walkability: {len(walk_rows):,}, culture: {len(culture_rows):,}, climate: {len(climate_rows):,}")

    # Batch update all scores via single UPDATE with VALUES
    print("Writing nature scores...")
    BS = 5000
    for i in range(0, len(nature_rows), BS):
        chunk = nature_rows[i:i+BS]
        vals = ",".join(cur.mogrify("(%s,%s)", r).decode() for r in chunk)
        cur.execute(f"""
            INSERT INTO city_metrics (city_id, nature_score) VALUES {vals}
            ON CONFLICT (city_id) DO UPDATE SET nature_score = EXCLUDED.nature_score
        """)
        conn.commit()

    print("Writing walkability scores...")
    for i in range(0, len(walk_rows), BS):
        chunk = walk_rows[i:i+BS]
        vals = ",".join(cur.mogrify("(%s,%s)", r).decode() for r in chunk)
        cur.execute(f"""
            INSERT INTO city_metrics (city_id, walkability_score) VALUES {vals}
            ON CONFLICT (city_id) DO UPDATE SET walkability_score = EXCLUDED.walkability_score
        """)
        conn.commit()

    print("Writing culture scores...")
    for i in range(0, len(culture_rows), BS):
        chunk = culture_rows[i:i+BS]
        vals = ",".join(cur.mogrify("(%s,%s)", r).decode() for r in chunk)
        cur.execute(f"""
            INSERT INTO city_metrics (city_id, culture_score) VALUES {vals}
            ON CONFLICT (city_id) DO UPDATE SET culture_score = EXCLUDED.culture_score
        """)
        conn.commit()

    print("Writing climate comfort scores...")
    for i in range(0, len(climate_rows), BS):
        chunk = climate_rows[i:i+BS]
        vals = ",".join(cur.mogrify("(%s,%s)", (cid, json.dumps({"climate_comfort": score}))).decode() for cid, score in chunk)
        cur.execute(f"""
            INSERT INTO city_metrics (city_id, raw) VALUES {vals}
            ON CONFLICT (city_id) DO UPDATE SET raw = city_metrics.raw || EXCLUDED.raw
        """)
        conn.commit()

    cur.close(); conn.close()

    # Summary
    print(f"\nDone in {time.time()-t0:.1f}s")
    conn2 = psycopg2.connect(**DB)
    cur2 = conn2.cursor()
    for col in ["cost_of_living_score", "nature_score", "culture_score", "walkability_score"]:
        cur2.execute(f"SELECT count(*), round(avg({col})::numeric,1), round(min({col})::numeric,1), round(max({col})::numeric,1) FROM city_metrics WHERE {col} IS NOT NULL")
        r = cur2.fetchone()
        if r[0]:
            print(f"  {col:<25} count={r[0]:>8,}  avg={r[1]:>5}  min={r[2]:>5}  max={r[3]:>5}")
    cur2.close(); conn2.close()


if __name__ == "__main__":
    main()
