"""
Build cost-of-living scores for cities using World Bank GDP per capita.

  python scripts/fetch-budget.py

Writes to city_metrics.cost_of_living_score (0-100, higher = more expensive).
"""
import json, math, time
from urllib.request import urlopen, Request

DB = {"host": "localhost", "port": 5432, "dbname": "akmleva", "user": "postgres", "password": "postgres"}


def fetch_gdp_per_capita():
    print("Fetching GDP per capita from World Bank...")
    url = "https://api.worldbank.org/v2/country/all/indicator/NY.GDP.PCAP.CD?format=json&per_page=500&date=2020:2024"
    req = Request(url, headers={"User-Agent": "AKMLEVA/1.0"})
    resp = urlopen(req, timeout=30)
    data = json.loads(resp.read())
    results = {}
    if len(data) < 2:
        return results
    for record in data[1]:
        iso3 = record.get("countryiso3code")
        value = record.get("value")
        year = record.get("date")
        if iso3 and value and len(iso3) == 3:
            if iso3 not in results or year > results[iso3]["year"]:
                results[iso3] = {"gdp_pc": float(value), "year": year}
    print(f"  {len(results)} countries with GDP data")
    return results


def main():
    t0 = time.time()
    import psycopg2

    gdp_data = fetch_gdp_per_capita()
    gdp_by_iso3 = {k: v["gdp_pc"] for k, v in gdp_data.items()}
    all_gdps = sorted(gdp_by_iso3.values())
    if not all_gdps:
        print("No GDP data!"); return

    p10 = all_gdps[len(all_gdps)//10]
    p90 = all_gdps[int(len(all_gdps)*0.9)]
    log_p10 = math.log10(max(p10, 1))
    log_p90 = math.log10(max(p90, 1))

    conn = psycopg2.connect(**DB)
    cur = conn.cursor()

    cur.execute("""
        SELECT ci.id, c.iso3 FROM cities ci JOIN countries c ON c.id = ci.country_id
    """)
    cities = cur.fetchall()
    print(f"  {len(cities):,} cities to score")

    rows = []
    for city_id, iso3 in cities:
        gdp = gdp_by_iso3.get(iso3)
        if not gdp:
            continue
        log_gdp = math.log10(max(gdp, 1))
        score = (log_gdp - log_p10) / (log_p90 - log_p10) * 100
        score = max(0, min(100, score))
        rows.append((city_id, int(round(score)), json.dumps({"gdp_per_capita": round(gdp), "iso3": iso3})))

    print(f"Inserting {len(rows):,} budget scores...")
    for i in range(0, len(rows), 5000):
        chunk = rows[i:i+5000]
        vals = ",".join(cur.mogrify("(%s,%s,%s)", r).decode() for r in chunk)
        cur.execute(f"""
            INSERT INTO city_metrics (city_id, cost_of_living_score, raw)
            VALUES {vals}
            ON CONFLICT (city_id) DO UPDATE SET
                cost_of_living_score = EXCLUDED.cost_of_living_score,
                raw = city_metrics.raw || EXCLUDED.raw
        """)
        conn.commit()

    cur.close(); conn.close()
    print(f"Done in {time.time()-t0:.1f}s — {len(rows)} cities scored")


if __name__ == "__main__":
    main()
