"""
Merge Yelp + Zomato + TripAdvisor + Michelin into one unified venues parquet.

Output: Database/restaurants/unified_venues.parquet

Normalized schema:
  source, source_id, name, address, city, country, latitude, longitude,
  cuisine, price_range (1-4), rating (1.0-5.0), review_count, award,
  phone, website, url

Dedup: normalized name + city + haversine ≤ 500m → keep highest-quality source.
Source priority: michelin > tripadvisor > yelp > zomato.
"""
import os, sys, time
from pathlib import Path

import duckdb

ROOT = Path(__file__).resolve().parent.parent.parent.parent  # scripts → data-pipeline → tools → repo root
BASE = ROOT / "Database" / "restaurants"
OUT_DIR = BASE / "unified_venues"
OUT_PARQUET = OUT_DIR / "unified_venues.parquet"

# Source quality priority (lower = better)
SOURCE_PRIORITY = {"michelin": 0, "tripadvisor": 1, "yelp": 2, "zomato": 3}

# Cuisine normalization: map source-specific terms → canonical
CUISINE_MAP = {
    # Italian
    "italian": "italian", "romana": "italian", "lazio": "italian",
    "central-italian": "italian", "northern-italian": "italian",
    "southern-italian": "italian", "siciliana": "italian",
    "pizzeria": "italian", "pizza": "italian",
    # Asian
    "chinese": "chinese", "cantonese": "chinese", "szechuan": "chinese",
    "sichuan": "chinese", "hunan": "chinese", "dim sum": "chinese",
    "japanese": "japanese", "sushi": "japanese", "ramen": "japanese",
    "teppanyaki": "japanese", "izakaya": "japanese", "udon": "japanese",
    "korean": "korean", "korean barbecue": "korean", "bbq": "korean",
    "thai": "thai", "vietnamese": "vietnamese", "pho": "vietnamese",
    "indian": "indian", "north indian": "indian", "south indian": "indian",
    "mughlai": "indian", "biryani": "indian",
    # Mediterranean
    "greek": "greek", "turkish": "turkish", "kebab": "turkish",
    "mediterranean": "mediterranean", "levantine": "mediterranean",
    "middle eastern": "mediterranean", "lebanese": "mediterranean",
    "falafel": "mediterranean",
    # French
    "french": "french", "bistro": "french", "brasserie": "french",
    "gastronomique": "french",
    # Spanish
    "spanish": "spanish", "tapas": "spanish", "basque": "spanish",
    "catalan": "spanish",
    # American
    "american": "american", "american (traditional)": "american",
    "american (new)": "american", "southern": "american",
    "cajun": "american", "creole": "american", "cajun/creole": "american",
    "bbq": "american", "barbecue": "american", "burger": "american",
    "burgers": "american", "hot dogs": "american",
    # Mexican / Latin
    "mexican": "mexican", "tex-mex": "mexican",
    "brazilian": "brazilian", "peruvian": "peruvian",
    "argentine": "south american", "colombian": "south american",
    "caribbean": "caribbean", "cuban": "caribbean",
    # Seafood
    "seafood": "seafood", "fish": "seafood", "sushi bar": "seafood",
    "raw bar": "seafood",
    # Vegetarian / Health
    "vegetarian": "vegetarian", "vegan": "vegetarian",
    "health food": "vegetarian", "salad": "vegetarian",
    # Pub / Bar
    "bar": "bar", "pub": "bar", "gastropub": "bar",
    "wine bar": "bar", "cocktail bar": "bar", "beer": "bar",
    "brewery": "bar",
    # Desserts / Bakery
    "bakery": "bakery", "pastry": "bakery", "cake": "bakery",
    "dessert": "dessert", "ice cream": "dessert", "gelato": "dessert",
    "chocolate": "dessert",
    # Coffee
    "cafe": "cafe", "coffee": "cafe", "coffee & tea": "cafe",
    "tea": "cafe",
    # Other
    "creative": "creative", "fusion": "creative",
    "contemporary": "creative", "international": "creative",
    "european": "european", "global": "european",
    "vegetarian friendly": "vegetarian", "vegan options": "vegetarian",
    "gluten free": None,  # not a cuisine
    "bar,": None,
}


def main():
    t0 = time.time()
    con = duckdb.connect()
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # ── 1. Yelp ──────────────────────────────────────────────────────────────
    print("Loading Yelp...")
    con.execute(f"""
        CREATE OR REPLACE TABLE yelp AS
        SELECT
            'yelp' AS source,
            business_id AS source_id,
            name,
            COALESCE(address, '') AS address,
            COALESCE(city, '') AS city,
            COALESCE(state, '') AS country,
            latitude, longitude,
            COALESCE(categories, '') AS cuisine_raw,
            CASE
                WHEN attributes IS NOT NULL AND attributes.RestaurantsPriceRange2 ~ '^[1-4]$'
                THEN TRY_CAST(attributes.RestaurantsPriceRange2 AS INTEGER)
                ELSE NULL
            END AS price_range,
            stars AS rating,
            COALESCE(review_count, 0) AS review_count,
            NULL::VARCHAR AS award,
            NULL::VARCHAR AS phone,
            NULL::VARCHAR AS website,
            business_id AS url
        FROM read_parquet('{BASE / "yelp_parquet" / "business.parquet"}')
        WHERE is_open = 1
          AND latitude IS NOT NULL AND longitude IS NOT NULL
          AND categories IS NOT NULL
          AND lower(categories) LIKE '%restaurant%'
    """)
    n_yelp = con.execute("SELECT count(*) FROM yelp").fetchone()[0]
    print(f"  {n_yelp:,} Yelp restaurants")

    # ── 2. Zomato ────────────────────────────────────────────────────────────
    print("Loading Zomato...")
    con.execute(f"""
        CREATE OR REPLACE TABLE zomato AS
        SELECT
            'zomato' AS source,
            CAST("Restaurant ID" AS VARCHAR) AS source_id,
            "Restaurant Name" AS name,
            COALESCE(Address, '') AS address,
            COALESCE(City, '') AS city,
            'India' AS country,
            Latitude, Longitude,
            COALESCE(Cuisines, '') AS cuisine_raw,
            "Price range" AS price_range,
            "Aggregate rating" AS rating,
            COALESCE(Votes, 0) AS review_count,
            NULL::VARCHAR AS award,
            NULL::VARCHAR AS phone,
            NULL::VARCHAR AS website,
            CAST("Restaurant ID" AS VARCHAR) AS url
        FROM read_parquet('{BASE / "zomato.parquet"}')
        WHERE Latitude IS NOT NULL AND Longitude IS NOT NULL
    """)
    n_zomato = con.execute("SELECT count(*) FROM zomato").fetchone()[0]
    print(f"  {n_zomato:,} Zomato restaurants")

    # ── 3. TripAdvisor ───────────────────────────────────────────────────────
    print("Loading TripAdvisor...")
    con.execute(f"""
        CREATE OR REPLACE TABLE tripadvisor AS
        SELECT
            'tripadvisor' AS source,
            restaurant_link AS source_id,
            restaurant_name AS name,
            COALESCE(address, '') AS address,
            COALESCE(city, '') AS city,
            COALESCE(country, '') AS country,
            latitude, longitude,
            COALESCE(cuisines, '') AS cuisine_raw,
            CASE price_level
                WHEN '€' THEN 1
                WHEN '€€-€€€' THEN 2
                WHEN '€€€€' THEN 3
                ELSE NULL
            END AS price_range,
            avg_rating AS rating,
            CAST(COALESCE(total_reviews_count, 0) AS BIGINT) AS review_count,
            NULL::VARCHAR AS award,
            NULL::VARCHAR AS phone,
            NULL::VARCHAR AS website,
            restaurant_link AS url
        FROM read_parquet('{BASE / "tripadvisor_european_restaurants.parquet"}')
        WHERE latitude IS NOT NULL AND longitude IS NOT NULL
          AND avg_rating IS NOT NULL
    """)
    n_ta = con.execute("SELECT count(*) FROM tripadvisor").fetchone()[0]
    print(f"  {n_ta:,} TripAdvisor restaurants")

    # ── 4. Michelin ──────────────────────────────────────────────────────────
    print("Loading Michelin...")
    con.execute(f"""
        CREATE OR REPLACE TABLE michelin AS
        SELECT
            'michelin' AS source,
            CAST(row_number() OVER () AS VARCHAR) AS source_id,
            Name AS name,
            COALESCE(Address, '') AS address,
            COALESCE(split_part(Location, ',', 1), '') AS city,
            COALESCE(Location, '') AS country,
            Latitude, Longitude,
            COALESCE(Cuisine, '') AS cuisine_raw,
            CASE Price
                WHEN '$' THEN 1
                WHEN '$$' THEN 2
                WHEN '$$$' THEN 3
                WHEN '$$$$' THEN 4
                ELSE NULL
            END AS price_range,
            CASE Award
                WHEN '3 Stars' THEN 5.0
                WHEN '2 Stars' THEN 4.5
                WHEN '1 Star' THEN 4.0
                WHEN 'Bib Gourmand' THEN 3.5
                WHEN 'Green Star' THEN 3.5
                ELSE 3.0
            END AS rating,
            0 AS review_count,
            Award AS award,
            PhoneNumber AS phone,
            WebsiteUrl AS website,
            COALESCE(Url, WebsiteUrl, '') AS url
        FROM read_parquet('{BASE / "Michelin" / "michelin_my_maps.parquet"}')
        WHERE Latitude IS NOT NULL AND Longitude IS NOT NULL
    """)
    n_mich = con.execute("SELECT count(*) FROM michelin").fetchone()[0]
    print(f"  {n_mich:,} Michelin restaurants")

    # ── 5. Union all + normalize cuisine ─────────────────────────────────────
    print("\nMerging + normalizing cuisines...")
    con.execute("""
        CREATE OR REPLACE TABLE all_venues AS
        SELECT * FROM yelp
        UNION ALL SELECT * FROM zomato
        UNION ALL SELECT * FROM tripadvisor
        UNION ALL SELECT * FROM michelin
    """)
    n_total = con.execute("SELECT count(*) FROM all_venues").fetchone()[0]
    print(f"  {n_total:,} total rows before dedup")

    # Normalize cuisine: lowercase, split by comma, map each term, rejoin
    # Build the CASE expression for cuisine normalization
    cuisine_cases = []
    for src, canon in CUISINE_MAP.items():
        if canon is None:
            cuisine_cases.append(f"WHEN lower(trim(v)) = '{src}' THEN ''")
        else:
            cuisine_cases.append(f"WHEN lower(trim(v)) = '{src}' THEN '{canon}'")
    cuisine_case_sql = "\n              ".join(cuisine_cases)

    con.execute(f"""
        CREATE OR REPLACE TABLE normalized AS
        SELECT
            source, source_id, name, address, city, country,
            latitude, longitude,
            -- Normalize cuisine: split → map → filter empty → join
            (
                SELECT string_agg(DISTINCT mapped, ', ' ORDER BY mapped)
                FROM (
                    SELECT CASE
                        {cuisine_case_sql}
                        ELSE lower(trim(v))
                    END AS mapped
                    FROM unnest(string_split(cuisine_raw, ', ')) AS t(v)
                    WHERE trim(v) != ''
                )
                WHERE mapped != ''
            ) AS cuisine,
            price_range,
            -- Clamp rating to 1.0-5.0
            GREATEST(1.0, LEAST(5.0, COALESCE(rating, 3.0))) AS rating,
            review_count,
            award, phone, website, url,
            -- Source priority for dedup
            CASE source
                WHEN 'michelin' THEN 0
                WHEN 'tripadvisor' THEN 1
                WHEN 'yelp' THEN 2
                WHEN 'zomato' THEN 3
                ELSE 9
            END AS src_priority
        FROM all_venues
        WHERE name IS NOT NULL AND name != ''
    """)

    # ── 6. Dedup: same city + haversine ≤ 500m → keep best source ───────────
    print("Deduplicating (500m radius, best source wins)...")
    sys.stdout.flush()
    t1 = time.time()

    con.execute(f"""
        CREATE OR REPLACE TABLE deduped AS
        WITH
        -- Assign a stable row id
        numbered AS (
            SELECT row_number() OVER () AS rid, *
            FROM normalized
        ),
        -- Find pairs within 500m in the same city
        nearby AS (
            SELECT
                a.rid AS rid_a,
                b.rid AS rid_b,
                a.src_priority AS pri_a,
                b.src_priority AS pri_b
            FROM numbered a
            JOIN numbered b
              ON a.rid < b.rid
              AND lower(trim(a.city)) = lower(trim(b.city))
              AND abs(a.latitude - b.latitude) < 0.005
              AND abs(a.longitude - b.longitude) < 0.005
              AND 6371.0 * 2 * asin(sqrt(
                  power(sin(radians(a.latitude - b.latitude) / 2), 2)
                  + cos(radians(a.latitude)) * cos(radians(b.latitude))
                  * power(sin(radians(a.longitude - b.longitude) / 2), 2)
              )) <= 0.5
        ),
        -- Mark the loser of each pair (higher priority number = worse)
        losers AS (
            SELECT CASE WHEN pri_a <= pri_b THEN rid_b ELSE rid_a END AS loser_rid
            FROM nearby
        )
        SELECT n.*
        FROM numbered n
        LEFT JOIN losers l ON n.rid = l.loser_rid
        WHERE l.loser_rid IS NULL
    """)
    n_deduped = con.execute("SELECT count(*) FROM deduped").fetchone()[0]
    n_removed = n_total - n_deduped
    print(f"  {n_deduped:,} unique venues ({n_removed:,} duplicates removed) ({time.time()-t1:.1f}s)")

    # ── 7. Assign venue_id (stable hash) ─────────────────────────────────────
    con.execute("""
        CREATE OR REPLACE TABLE final AS
        SELECT
            md5(lower(trim(name)) || '|' || lower(trim(city)) || '|' || cast(round(latitude, 4) AS VARCHAR)) AS venue_id,
            source, source_id, name, address, city, country,
            latitude, longitude, cuisine, price_range, rating,
            review_count, award, phone, website, url
        FROM deduped
    """)

    # ── 8. Write output ──────────────────────────────────────────────────────
    con.execute(f"COPY final TO '{OUT_PARQUET}' (FORMAT PARQUET, COMPRESSION 'zstd')")

    size_mb = os.path.getsize(OUT_PARQUET) / (1024 * 1024)
    n_final = con.execute("SELECT count(*) FROM final").fetchone()[0]

    print(f"\n{'='*60}")
    print(f"Output: {OUT_PARQUET}")
    print(f"  Total venues:   {n_final:,}")
    print(f"  File size:      {size_mb:.1f} MB")
    print(f"{'='*60}")

    # Stats by source
    print(f"\nBy source:")
    rows = con.execute("""
        SELECT source, count(*) AS cnt,
               round(avg(price_range), 1) AS avg_price,
               round(avg(rating), 2) AS avg_rating,
               CAST(avg(review_count) AS INTEGER) AS avg_reviews
        FROM final GROUP BY source ORDER BY cnt DESC
    """).fetchall()
    for src, cnt, ap, ar, av in rows:
        print(f"  {src:15s}  {cnt:>8,} venues  avg price {ap}  ★{ar}  avg reviews {av:,}")

    # Stats by country (top 15)
    print(f"\nTop 15 countries:")
    rows = con.execute("""
        SELECT country, count(*) AS cnt
        FROM final WHERE country != ''
        GROUP BY country ORDER BY cnt DESC LIMIT 15
    """).fetchall()
    for country, cnt in rows:
        print(f"  {country:30s}  {cnt:>8,}")

    # Cuisine distribution (top 15)
    print(f"\nTop 15 cuisines (after normalization):")
    rows = con.execute("""
        SELECT t.cuisine, count(*) AS cnt
        FROM final, unnest(string_split(final.cuisine, ', ')) AS t(cuisine)
        WHERE t.cuisine != ''
        GROUP BY t.cuisine ORDER BY cnt DESC LIMIT 15
    """).fetchall()
    for cuisine, cnt in rows:
        print(f"  {cuisine:25s}  {cnt:>8,}")

    # Price range distribution
    print(f"\nPrice range distribution:")
    rows = con.execute("""
        SELECT price_range, count(*) AS cnt
        FROM final WHERE price_range IS NOT NULL
        GROUP BY price_range ORDER BY price_range
    """).fetchall()
    labels = {1: "$ (cheap)", 2: "$$ (moderate)", 3: "$$$ (upscale)", 4: "$$$$ (expensive)"}
    for pr, cnt in rows:
        label = labels.get(int(pr), f"${int(pr)}")
        pct = cnt / n_final * 100
        print(f"  {label:25s}  {cnt:>10,} ({pct:.1f}%)")

    print(f"\nTotal time: {time.time()-t0:.1f}s")


if __name__ == "__main__":
    main()
