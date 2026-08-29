-- Travel Intelligence Phase 1 Upgrade
-- Adds continentCode, isSovereign to Country
-- Adds admin hierarchy, feature codes, isPrimary to City
-- Enriches CityMetric, CityMonthlyMetric, CityEmbedding, UserTravelProfile

-- ============================================
-- COUNTRY: new columns
-- ============================================
ALTER TABLE "countries" ADD COLUMN "continent_code" VARCHAR(4);
ALTER TABLE "countries" ADD COLUMN "is_sovereign" BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_countries_continent_code ON "countries"("continent_code");

-- ============================================
-- CITY: new columns
-- ============================================
ALTER TABLE "cities" ADD COLUMN "ascii_name" VARCHAR(200);
ALTER TABLE "cities" ADD COLUMN "country_code" VARCHAR(2);
ALTER TABLE "cities" ADD COLUMN "admin1_code" VARCHAR(20);
ALTER TABLE "cities" ADD COLUMN "admin1_name" VARCHAR(120);
ALTER TABLE "cities" ADD COLUMN "admin2_code" VARCHAR(20);
ALTER TABLE "cities" ADD COLUMN "admin2_name" VARCHAR(120);
ALTER TABLE "cities" ADD COLUMN "feature_class" VARCHAR(2);
ALTER TABLE "cities" ADD COLUMN "feature_code" VARCHAR(10);
ALTER TABLE "cities" ADD COLUMN "is_primary" BOOLEAN NOT NULL DEFAULT false;

-- Backfill countryCode from countries table
UPDATE "cities" c
SET "country_code" = co."iso2"
FROM "countries" co
WHERE c."country_id" = co."id" AND c."country_code" IS NULL;

-- Indexes for new columns
CREATE INDEX IF NOT EXISTS idx_cities_country_code ON "cities"("country_code");
CREATE INDEX IF NOT EXISTS idx_cities_feature_code ON "cities"("feature_code");
CREATE INDEX IF NOT EXISTS idx_cities_admin1_code ON "cities"("admin1_code");
CREATE INDEX IF NOT EXISTS idx_cities_population_desc ON "cities"("population" DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_cities_primary_population ON "cities"("is_primary", "population" DESC NULLS LAST);

-- ============================================
-- CITY METRIC: new columns
-- ============================================
ALTER TABLE "city_metrics" ADD COLUMN "transit_score" SMALLINT;
ALTER TABLE "city_metrics" ADD COLUMN "solo_female_safety_score" SMALLINT;
ALTER TABLE "city_metrics" ADD COLUMN "average_rent_studio_usd" REAL;
ALTER TABLE "city_metrics" ADD COLUMN "data_source" VARCHAR(50);
ALTER TABLE "city_metrics" ADD COLUMN "last_fetched_at" TIMESTAMP(3);

-- ============================================
-- CITY MONTHLY METRIC: restructure
-- ============================================
-- Step 1: Deduplicate old EAV data — keep only one row per (city_id, month)
-- by collapsing domain/metric/value into a single row per city/month.
-- This preserves existing data while allowing the new flat structure.
DELETE FROM "city_monthly_metrics"
WHERE id IN (
  SELECT id FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY "city_id", "month" ORDER BY "id") AS rn
    FROM "city_monthly_metrics"
  ) sub
  WHERE rn > 1
);

-- Step 2: Add new columns
ALTER TABLE "city_monthly_metrics" ADD COLUMN "avg_temp_max_c" REAL;
ALTER TABLE "city_monthly_metrics" ADD COLUMN "avg_temp_min_c" REAL;
ALTER TABLE "city_monthly_metrics" ADD COLUMN "precipitation_mm" REAL;
ALTER TABLE "city_monthly_metrics" ADD COLUMN "sunshine_hours" REAL;
ALTER TABLE "city_monthly_metrics" ADD COLUMN "uv_index_max" REAL;
ALTER TABLE "city_monthly_metrics" ADD COLUMN "wind_speed_max_kmh" REAL;
ALTER TABLE "city_monthly_metrics" ADD COLUMN "snowfall_mm" REAL;
ALTER TABLE "city_monthly_metrics" ADD COLUMN "rainy_days" SMALLINT;
ALTER TABLE "city_monthly_metrics" ADD COLUMN "price_multiplier" REAL;
ALTER TABLE "city_monthly_metrics" ADD COLUMN "crowd_score" SMALLINT;
ALTER TABLE "city_monthly_metrics" ADD COLUMN "ideal_for" VARCHAR(200);

-- Step 3: Relax NOT NULL on legacy columns
ALTER TABLE "city_monthly_metrics" ALTER COLUMN "domain" DROP NOT NULL;
ALTER TABLE "city_monthly_metrics" ALTER COLUMN "metric" DROP NOT NULL;
ALTER TABLE "city_monthly_metrics" ALTER COLUMN "value" DROP NOT NULL;

-- Step 4: Replace unique constraint
ALTER TABLE "city_monthly_metrics" DROP CONSTRAINT IF EXISTS "city_monthly_metrics_city_id_month_domain_metric_key";
ALTER TABLE "city_monthly_metrics" ADD CONSTRAINT "city_monthly_metrics_city_id_month_key" UNIQUE ("city_id", "month");

-- ============================================
-- CITY EMBEDDING: new columns
-- ============================================
ALTER TABLE "city_embeddings" ADD COLUMN "model" VARCHAR(50) NOT NULL DEFAULT 'text-embedding-3-small';
ALTER TABLE "city_embeddings" ADD COLUMN "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now();

-- ============================================
-- USER TRAVEL PROFILE: new columns
-- ============================================
ALTER TABLE "user_travel_profiles" ADD COLUMN "max_daily_budget_usd" INTEGER;
ALTER TABLE "user_travel_profiles" ADD COLUMN "min_safety_score" SMALLINT;
ALTER TABLE "user_travel_profiles" ADD COLUMN "min_walkability_score" SMALLINT;
ALTER TABLE "user_travel_profiles" ADD COLUMN "avoid_climates" JSONB DEFAULT '[]';
ALTER TABLE "user_travel_profiles" ADD COLUMN "pace_preference" VARCHAR(20);
ALTER TABLE "user_travel_profiles" ADD COLUMN "crowd_tolerance" VARCHAR(20);
ALTER TABLE "user_travel_profiles" ADD COLUMN "home_city_id" VARCHAR(36);
ALTER TABLE "user_travel_profiles" ADD COLUMN "travel_months" JSONB;
ALTER TABLE "user_travel_profiles" ADD COLUMN "dietary_preferences" JSONB DEFAULT '[]';
ALTER TABLE "user_travel_profiles" ADD COLUMN "interests" JSONB DEFAULT '[]';
ALTER TABLE "user_travel_profiles" ADD COLUMN "accessibility_needs" JSONB DEFAULT '[]';
