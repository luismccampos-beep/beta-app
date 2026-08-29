"""
Generate deterministic city embeddings for pgvector similarity search.

Creates 1536-dim vectors from city features (geo, population, scores, climate).
Not LLM-quality but functional for cosine similarity ranking.

  python scripts/generate-city-embeddings.py

Writes: city_embeddings table
"""
import hashlib, struct, time, math
from collections import defaultdict

DB = {"host": "localhost", "port": 5432, "dbname": "akmleva", "user": "postgres", "password": "postgres"}
DIM = 1536


def deterministic_hash(seed):
    """Use MD5 to get a deterministic 128-bit hash from any string."""
    return hashlib.md5(str(seed).encode()).digest()


def seed_to_vector(seed, dim=DIM):
    """Generate a deterministic float vector from a seed string."""
    h = deterministic_hash(seed)
    vec = []
    for i in range(dim):
        byte = h[i % len(h)]
        # Mix with position to avoid repeating pattern
        mixed = byte ^ (i * 37 & 0xFF)
        # Map 0-255 to -1..1
        vec.append((mixed / 127.5) - 1.0)
    return vec


def normalize(vec):
    norm = math.sqrt(sum(x*x for x in vec))
    if norm == 0:
        return vec
    return [x/norm for x in vec]


def add_weighted(dest, src, weight):
    for i in range(len(dest)):
        dest[i] += src[i] * weight


def main():
    t0 = time.time()
    import psycopg2
    conn = psycopg2.connect(**DB)
    cur = conn.cursor()

    print("Loading cities...")
    cur.execute("""
        SELECT ci.id, ci.name, ci.latitude, ci.longitude,
               ci.population, ci.elevation, ci.is_coastal, ci.is_island,
               ci.is_capital, ci.airport_iata,
               cm.cost_of_living_score, cm.nature_score, cm.culture_score,
               cm.walkability_score, cm.safety_score, cm.healthcare_score,
               c.name as country_name, c.continent, c.iso3
        FROM cities ci
        JOIN countries c ON c.id = ci.country_id
        LEFT JOIN city_metrics cm ON cm.city_id = ci.id
    """)
    cols = ["id", "name", "lat", "lng", "pop", "elev", "coastal", "island",
            "capital", "airport", "col", "nature", "culture", "walk",
            "safety", "health", "country", "continent", "iso3"]
    cities = [dict(zip(cols, row)) for row in cur.fetchall()]
    print(f"  {len(cities):,} cities")

    print("Loading venue stats...")
    cur.execute("""
        SELECT city_id, count(*) as cnt, count(award) FILTER (WHERE award IS NOT NULL) as awards
        FROM destination_venues WHERE city_id IS NOT NULL
        GROUP BY city_id
    """)
    venue_stats = {r[0]: r[1] for r in cur.fetchall()}

    print("Loading climate comfort...")
    cur.execute("SELECT city_id, raw->>'climate_comfort' FROM city_metrics WHERE raw ? 'climate_comfort'")
    climate_comfort = {}
    for cid, cc in cur.fetchall():
        if cc:
            climate_comfort[cid] = float(cc)

    print(f"Generating {DIM}-dim embeddings for {len(cities):,} cities...")
    embeddings = []

    for city in cities:
        cid = city["id"]
        vec = [0.0] * DIM

        # 1. Geographic features (weight: 0.30)
        geo_seed = f"geo:{city['lat']:.2f}:{city['lng']:.2f}"
        add_weighted(vec, seed_to_vector(geo_seed), 0.30)

        # 2. Continent + country (weight: 0.15)
        geo_region = f"region:{city['continent']}:{city['iso3']}"
        add_weighted(vec, seed_to_vector(geo_region), 0.15)

        # 3. City name (weight: 0.10) — gives each city unique signal
        add_weighted(vec, seed_to_vector(f"name:{city['name']}"), 0.10)

        # 4. Population tier (weight: 0.10)
        pop = city["pop"] or 0
        if pop > 1_000_000: pop_tier = "mega"
        elif pop > 100_000: pop_tier = "large"
        elif pop > 10_000: pop_tier = "medium"
        else: pop_tier = "small"
        add_weighted(vec, seed_to_vector(f"pop:{pop_tier}"), 0.10)

        # 5. Score features (weight: 0.20)
        for field, weight in [("col", 0.03), ("nature", 0.03), ("culture", 0.03),
                              ("walk", 0.03), ("safety", 0.02), ("health", 0.02),
                              ("climate", 0.04)]:
            if field == "climate":
                val = climate_comfort.get(cid)
            else:
                val = city.get(field)
            if val is not None:
                # Quantize to 5 buckets for similarity grouping
                bucket = int(val / 20) * 20
                add_weighted(vec, seed_to_vector(f"{field}:{bucket}"), weight)

        # 6. Physical features (weight: 0.10)
        if city["coastal"]:
            add_weighted(vec, seed_to_vector("feat:coastal"), 0.05)
        if city["island"]:
            add_weighted(vec, seed_to_vector("feat:island"), 0.03)
        if city["capital"]:
            add_weighted(vec, seed_to_vector("feat:capital"), 0.02)

        # 7. Venue density (weight: 0.05)
        vs = venue_stats.get(cid, 0)
        if vs > 100:
            add_weighted(vec, seed_to_vector("venues:major"), 0.05)
        elif vs > 20:
            add_weighted(vec, seed_to_vector("venues:popular"), 0.05)
        elif vs > 0:
            add_weighted(vec, seed_to_vector("venues:some"), 0.05)

        # Normalize
        vec = normalize(vec)

        # Tags
        tags = {"continent": city["continent"], "iso3": city["iso3"]}
        if city["coastal"]: tags["coastal"] = True
        if city["island"]: tags["island"] = True
        if city["capital"]: tags["capital"] = True
        if pop > 1_000_000: tags["megacity"] = True
        embeddings.append((cid, vec, tags))

    print(f"Writing {len(embeddings):,} embeddings...")

    # Delete existing
    cur.execute("DELETE FROM city_embeddings")
    conn.commit()

    # Batch insert using executemany with cast
    import json as json_mod
    BS = 500
    for i in range(0, len(embeddings), BS):
        chunk = embeddings[i:i+BS]
        rows = [(cid, "[" + ",".join(f"{x:.6f}" for x in vec) + "]", json_mod.dumps(tags))
                for cid, vec, tags in chunk]
        cur.executemany("""
            INSERT INTO city_embeddings (city_id, vector, tags)
            VALUES (%s, %s::vector, %s::jsonb)
        """, rows)
        conn.commit()
        if (i // BS) % 20 == 0:
            print(f"  {min(i+BS, len(embeddings)):,}/{len(embeddings):,}")

    cur.close(); conn.close()

    elapsed = time.time()-t0
    print(f"Done in {elapsed:.1f}s — {len(embeddings)} embeddings")

    # Verify
    conn2 = psycopg2.connect(**DB)
    cur2 = conn2.cursor()
    cur2.execute("SELECT count(*) FROM city_embeddings")
    print(f"  city_embeddings: {cur2.fetchone()[0]}")
    # Test similarity search
    cur2.execute("""
        SELECT ce.city_id, ci.name, ce.vector <-> '[0,0,0,0]'::vector as dist
        FROM city_embeddings ce JOIN cities ci ON ci.id = ce.city_id
        LIMIT 3
    """)
    print("  Sample similarity (vs zero vector):")
    for r in cur2.fetchall():
        print(f"    {r[1]}: {r[2]:.4f}")
    cur2.close(); conn2.close()


if __name__ == "__main__":
    main()
