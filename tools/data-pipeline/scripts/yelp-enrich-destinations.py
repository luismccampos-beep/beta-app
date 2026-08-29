"""
Enrich travel destinations with Yelp restaurant/venue data.

Modes:
  1. --destinations <path>  — join Yelp businesses to an external destinations file
  2. (default)              — group Yelp businesses by their own city → per-city venue catalog

Output: yelp_venues.parquet (one row per destination×venue)

Usage:
  python scripts/yelp-enrich-destinations.py
  python scripts/yelp-enrich-destinations.py --destinations path/to/destinos.parquet
  python scripts/yelp-enrich-destinations.py --destinations path/to/destinos.json --radius-km 30
"""
import argparse, os, sys, time
from pathlib import Path

import duckdb

# ── paths ────────────────────────────────────────────────────────────────────
ROOT = Path(__file__).resolve().parent.parent.parent.parent  # scripts → data-pipeline → tools → repo root
BUSINESS_PARQUET = ROOT / "Database" / "restaurants" / "yelp_parquet" / "business.parquet"
OUT_DIR = ROOT / "Database" / "restaurants" / "yelp_enriched"

# Yelp restaurant/food category keywords (case-insensitive match on categories column)
FOOD_CATEGORIES = (
    "restaurant", "food", "cafe", "coffee", "tea", "bar", "pub", "brewery",
    "bakery", "dessert", "ice cream", "pizza", "sushi", "seafood", "steak",
    "taco", "burger", "sandwich", "noodle", "ramen", "sushi", "bbq",
    "diner", "buffet", "food truck", "wine bar", "cocktail", "juice",
    "smoothie", "creperie", "waffle", "donut", "bagel", "poke",
    "tapas", "dim sum", "falafel", "kebab", "gyro", "pho", "bahn mi",
    "curry", "indian", "thai", "chinese", "japanese", "korean", "mexican",
    "italian", "french", "greek", "turkish", "brazilian", "caribbean",
    "ethiopian", "jamaican", "cuban", "hawaiian", "mediterranean",
    "vietnamese", "filipino", "pakistani", "bangladeshi", "lebanese",
    "moroccan", "egyptian", "peruvian", "argentine", "colombian",
    "venezuelan", "chilean", "dominican", "puerto rican",
)

TOP_N_PER_DESTINATION = 15  # keep top N venues per destination
MAX_RADIUS_KM = 50  # coordinate matching radius


def load_destinations(path):
    """Load destinations from parquet or JSON. Must have columns: nome, city (or name), pais (or country), latitude, longitude."""
    ext = Path(path).suffix.lower()
    con = duckdb.connect()
    if ext == ".parquet":
        df = con.execute(f"SELECT * FROM read_parquet('{path}')").fetchdf()
    elif ext in (".json", ".jsonl"):
        df = con.execute(f"SELECT * FROM read_json_auto('{path}', union_by_name=true)").fetchdf()
    else:
        raise ValueError(f"Unsupported destination format: {ext}")

    # Normalize column names
    rename_map = {}
    for col in df.columns:
        cl = col.lower()
        if cl in ("name", "nome", "destination_name"):
            rename_map[col] = "dest_name"
        elif cl in ("city", "cidade"):
            rename_map[col] = "dest_city"
        elif cl in ("country", "pais", "país"):
            rename_map[col] = "dest_country"
        elif cl in ("latitude", "lat"):
            rename_map[col] = "dest_lat"
        elif cl in ("longitude", "lng", "lon", "long"):
            rename_map[col] = "dest_lng"
    df = df.rename(columns=rename_map)

    required = {"dest_name", "dest_city", "dest_lat", "dest_lng"}
    missing = required - set(df.columns)
    if missing:
        raise ValueError(f"Destinations file missing columns: {missing}. Available: {list(df.columns)}")
    return df


def main():
    parser = argparse.ArgumentParser(description="Enrich destinations with Yelp venues")
    parser.add_argument("--destinations", help="Path to destinations parquet/json (optional)")
    parser.add_argument("--radius-km", type=float, default=MAX_RADIUS_KM, help=f"Max coordinate distance (default {MAX_RADIUS_KM})")
    parser.add_argument("--top-n", type=int, default=TOP_N_PER_DESTINATION, help=f"Top N venues per destination (default {TOP_N_PER_DESTINATION})")
    parser.add_argument("--output", help="Output parquet path (default: yelp_enriched/yelp_venues.parquet)")
    args = parser.parse_args()

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = args.output or str(OUT_DIR / "yelp_venues.parquet")

    con = duckdb.connect()

    # ── 1. Load Yelp businesses, filter to food/restaurant ────────────────────
    print(f"Loading Yelp businesses from {BUSINESS_PARQUET}...")
    sys.stdout.flush()
    t0 = time.time()

    # Build SQL filter for food/restaurant categories
    cat_conditions = " OR ".join(
        f"lower(categories) LIKE '%{term}%'" for term in FOOD_CATEGORIES
    )
    con.execute(f"""
        CREATE OR REPLACE TABLE food AS
        SELECT
            business_id, name, address, city, state, postal_code,
            latitude, longitude, stars, review_count, is_open,
            categories,
            CASE
                WHEN attributes IS NOT NULL THEN
                    COALESCE(
                        TRY_CAST(attributes.RestaurantsPriceRange2 AS INTEGER),
                        NULL
                    )
                ELSE NULL
            END AS price_range,
            string_split(COALESCE(categories, ''), ', ') AS category_list
        FROM read_parquet('{BUSINESS_PARQUET}')
        WHERE is_open = 1
          AND categories IS NOT NULL
          AND ({cat_conditions})
          AND latitude IS NOT NULL
          AND longitude IS NOT NULL
    """)
    food_count = con.execute("SELECT count(*) FROM food").fetchone()[0]
    print(f"  {food_count:,} open food/restaurant businesses with coordinates ({time.time()-t0:.1f}s)")

    # ── 3. Mode selection ─────────────────────────────────────────────────────
    if args.destinations:
        run_destinations_mode(con, args, out_path)
    else:
        run_city_mode(con, args, out_path)


def run_destinations_mode(con, args, out_path):
    """Match Yelp venues to an external destinations file."""
    print(f"\nLoading destinations from {args.destinations}...")
    dests = load_destinations(args.destinations)
    con.register("dests_df", dests)
    con.execute("""
        CREATE OR REPLACE TABLE destinations AS
        SELECT * FROM dests_df
        WHERE dest_lat IS NOT NULL AND dest_lng IS NOT NULL
    """)
    n_dests = con.execute("SELECT count(*) FROM destinations").fetchone()[0]
    print(f"  {n_dests:,} destinations with coordinates")

    n_food = con.execute("SELECT count(*) FROM food").fetchone()[0]
    print(f"  {n_food:,} food businesses with coordinates")

    # Coordinate-based matching via DuckDB cross product with distance filter
    # For performance, bucket by rough grid (0.5° ≈ 55km) first
    print("Matching by city name + coordinate proximity...")
    sys.stdout.flush()
    t0 = time.time()

    matches = con.execute(f"""
        WITH grid_match AS (
            SELECT
                d.dest_name, d.dest_city, d.dest_country, d.dest_lat, d.dest_lng,
                f.business_id, f.name, f.address, f.city AS yelp_city, f.state AS yelp_state,
                f.latitude, f.longitude, f.stars, f.review_count, f.categories,
                f.price_range, f.category_list,
                -- Approximate distance (fast grid pre-filter using degree offsets)
                abs(d.dest_lat - f.latitude) AS dlat,
                abs(d.dest_lng - f.longitude) AS dlng
            FROM destinations d
            CROSS JOIN food f
            WHERE abs(d.dest_lat - f.latitude) < {args.radius_km / 80.0 + 0.2}
              AND abs(d.dest_lng - f.longitude) < {args.radius_km / 80.0 + 0.2}
        )
        SELECT * FROM grid_match
        WHERE (dlat * dlat + dlng * dlng) < ({args.radius_km / 111.0 + 0.01}) * ({args.radius_km / 111.0 + 0.01})
    """).fetchdf()

    # Haversine distance in SQL
    con.execute(f"""
        CREATE OR REPLACE TABLE matches AS
        WITH grid_match AS (
            SELECT
                d.dest_name, d.dest_city, d.dest_country, d.dest_lat, d.dest_lng,
                f.business_id, f.name, f.address, f.city AS yelp_city, f.state AS yelp_state,
                f.latitude, f.longitude, f.stars, f.review_count, f.categories,
                f.price_range, f.category_list,
                abs(d.dest_lat - f.latitude) AS dlat,
                abs(d.dest_lng - f.longitude) AS dlng
            FROM destinations d
            CROSS JOIN food f
            WHERE abs(d.dest_lat - f.latitude) < {args.radius_km / 80.0 + 0.2}
              AND abs(d.dest_lng - f.longitude) < {args.radius_km / 80.0 + 0.2}
        )
        SELECT *,
            6371.0 * 2 * asin(sqrt(
                power(sin(radians(dest_lat - latitude) / 2), 2)
                + cos(radians(dest_lat)) * cos(radians(latitude))
                * power(sin(radians(dest_lng - longitude) / 2), 2)
            )) AS distance_km
        FROM grid_match
        WHERE (dlat * dlat + dlng * dlng) < ({args.radius_km / 111.0 + 0.01}) * ({args.radius_km / 111.0 + 0.01})
    """)
    con.execute(f"DELETE FROM matches WHERE distance_km > {args.radius_km}")
    n_matches = con.execute("SELECT count(*) FROM matches").fetchone()[0]
    print(f"  {n_matches:,} raw matches ({time.time()-t0:.1f}s)")

    # Rank: city-name match bonus + stars + review_count
    con.execute("""
        CREATE OR REPLACE TABLE ranked_matches AS
        SELECT *,
            (CASE WHEN lower(trim(yelp_city)) = lower(trim(dest_city)) THEN 100.0 ELSE 0.0 END
             + stars * 10.0
             + LEAST(review_count, 1000) * 0.01) AS rank_score,
            ROW_NUMBER() OVER (
                PARTITION BY dest_name
                ORDER BY (CASE WHEN lower(trim(yelp_city)) = lower(trim(dest_city)) THEN 100.0 ELSE 0.0 END
                          + stars * 10.0 + LEAST(review_count, 1000) * 0.01) DESC
            ) AS rn
        FROM matches
    """)
    con.execute(f"CREATE OR REPLACE TABLE output AS SELECT * FROM ranked_matches WHERE rn <= {args.top_n}")

    write_output(con, "output", out_path, mode="destinations")


def run_city_mode(con, args, out_path):
    """Group Yelp businesses by city → top venues per city."""
    print("\nGrouping by Yelp city...")
    sys.stdout.flush()
    t0 = time.time()

    con.execute(f"""
        CREATE OR REPLACE TABLE output AS
        WITH ranked AS (
            SELECT
                *,
                city AS dest_name,
                city AS dest_city,
                state AS dest_country,
                latitude AS dest_lat,
                longitude AS dest_lng,
                ROW_NUMBER() OVER (
                    PARTITION BY city, state
                    ORDER BY stars DESC, review_count DESC
                ) AS rn
            FROM food
            WHERE latitude IS NOT NULL
              AND city IS NOT NULL
              AND city != ''
        )
        SELECT
            dest_name, dest_city, dest_country, dest_lat, dest_lng,
            business_id, name, address,
            city AS yelp_city, state AS yelp_state,
            latitude, longitude, stars, review_count,
            categories, price_range,
            rn AS rank_in_city
        FROM ranked
        WHERE rn <= {args.top_n}
        ORDER BY dest_name, rn
    """)
    n_cities = con.execute("SELECT count(DISTINCT dest_name) FROM output").fetchone()[0]
    n_rows = con.execute("SELECT count(*) FROM output").fetchone()[0]
    print(f"  {n_cities:,} cities, {n_rows:,} venue rows ({time.time()-t0:.1f}s)")

    write_output(con, "output", out_path, mode="city-grouped")


def write_output(con, table, out_path, mode):
    """Write final parquet + print summary stats — all via DuckDB SQL."""
    con.execute(f"COPY {table} TO '{out_path}' (FORMAT PARQUET, COMPRESSION 'zstd')")

    size_mb = os.path.getsize(out_path) / (1024 * 1024)
    n_dest = con.execute(f"SELECT count(DISTINCT dest_name) FROM {table}").fetchone()[0]
    n_venues = con.execute(f"SELECT count(*) FROM {table}").fetchone()[0]

    print(f"\n{'='*60}")
    print(f"Output: {out_path}")
    print(f"  Mode:           {mode}")
    print(f"  Destinations:   {n_dest:,}")
    print(f"  Total venues:   {n_venues:,}")
    print(f"  File size:      {size_mb:.1f} MB")
    print(f"{'='*60}")

    # Top destinations by venue count
    if n_dest > 0:
        rows = con.execute(f"""
            SELECT dest_name,
                   count(*) AS venue_count,
                   round(avg(stars), 1) AS avg_stars,
                   CAST(avg(review_count) AS INTEGER) AS avg_reviews,
                   avg(price_range) AS avg_price
            FROM {table}
            GROUP BY dest_name
            ORDER BY venue_count DESC
            LIMIT 15
        """).fetchall()
        print(f"\nTop 15 destinations by venue count:")
        for name, vc, avg_s, avg_r, avg_p in rows:
            pr = f"${int(avg_p)}" if avg_p and avg_p == avg_p else "N/A"
            print(f"  {name:35s}  {vc:3d} venues  ★{avg_s}  avg reviews {avg_r:,}  price ~{pr}")

    # Price range distribution
    price_rows = con.execute(f"""
        SELECT price_range, count(*) AS cnt
        FROM {table}
        WHERE price_range IS NOT NULL
        GROUP BY price_range
        ORDER BY price_range
    """).fetchall()
    if price_rows:
        labels = {1: "$ (cheap)", 2: "$$ (moderate)", 3: "$$$ (upscale)", 4: "$$$$ (expensive)"}
        print(f"\nPrice range distribution:")
        for pr, count in price_rows:
            label = labels.get(int(pr), f"${int(pr)}")
            pct = count / n_venues * 100
            print(f"  {label:25s}  {count:,} venues ({pct:.1f}%)")


if __name__ == "__main__":
    main()
