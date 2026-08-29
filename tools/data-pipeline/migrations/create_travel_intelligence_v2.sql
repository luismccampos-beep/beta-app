-- Full Travel Intelligence schema + pgvector
-- Applied to fresh akmleva database

CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- COUNTRIES
-- ============================================
CREATE TABLE IF NOT EXISTS countries (
    id              VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    iso2            VARCHAR(2) NOT NULL UNIQUE,
    iso3            VARCHAR(3),
    name            VARCHAR(120) NOT NULL,
    name_en         VARCHAR(120),
    wikidata_id     VARCHAR(16),
    geonames_id     INTEGER,
    continent       VARCHAR(20),
    latitude        REAL,
    longitude       REAL,
    area            REAL,
    population      BIGINT,
    capital_city    VARCHAR(120),
    currency        VARCHAR(8),
    currency_symbol VARCHAR(4),
    languages       JSONB,
    plug_types      JSONB,
    driving_side    VARCHAR(10),
    calling_code    VARCHAR(8),
    visa_required   JSONB,
    emergency_number VARCHAR(20),
    created_at      TIMESTAMP NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_countries_continent ON countries(continent);

-- ============================================
-- CITIES
-- ============================================
CREATE TABLE IF NOT EXISTS cities (
    id              VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    country_id      VARCHAR(36) NOT NULL REFERENCES countries(id),
    slug            VARCHAR(64) NOT NULL UNIQUE,
    wikidata_id     VARCHAR(16),
    geonames_id     INTEGER,
    osm_id          VARCHAR(32),
    name            VARCHAR(200) NOT NULL,
    name_en         VARCHAR(200),
    region          VARCHAR(120),
    timezone        VARCHAR(40),
    elevation       REAL,
    latitude        REAL NOT NULL,
    longitude       REAL NOT NULL,
    population      BIGINT,
    area            REAL,
    density         REAL,
    english_level   REAL,
    is_coastal      BOOLEAN NOT NULL DEFAULT false,
    is_island       BOOLEAN NOT NULL DEFAULT false,
    is_capital      BOOLEAN NOT NULL DEFAULT false,
    airport_iata    VARCHAR(8),
    airport_name    VARCHAR(200),
    metadata        JSONB,
    created_at      TIMESTAMP NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cities_country ON cities(country_id);
CREATE INDEX IF NOT EXISTS idx_cities_coords  ON cities(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_cities_name_en ON cities(name_en);
CREATE INDEX IF NOT EXISTS idx_cities_coastal ON cities(is_coastal, is_island);

-- ============================================
-- CITY METRICS (per-field, normalized 0-100)
-- ============================================
CREATE TABLE IF NOT EXISTS city_metrics (
    id                    VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    city_id               VARCHAR(36) NOT NULL UNIQUE REFERENCES cities(id) ON DELETE CASCADE,
    cost_of_living_score  SMALLINT,
    safety_score          SMALLINT,
    healthcare_score      SMALLINT,
    nature_score          SMALLINT,
    culture_score         SMALLINT,
    walkability_score     SMALLINT,
    lgbtq_safety_score    SMALLINT,
    internet_speed_mbps   REAL,
    raw                   JSONB,
    computed_at           TIMESTAMP NOT NULL DEFAULT now()
);

-- ============================================
-- CITY MONTHLY METRICS (12 months × N metrics)
-- ============================================
CREATE TABLE IF NOT EXISTS city_monthly_metrics (
    id          VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    city_id     VARCHAR(36) NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    month       SMALLINT NOT NULL CHECK (month >= 1 AND month <= 12),
    domain      VARCHAR(30) NOT NULL,
    metric      VARCHAR(60) NOT NULL,
    value       REAL NOT NULL,
    normalized  REAL,
    source      VARCHAR(50),
    computed_at TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE(city_id, month, domain, metric)
);

CREATE INDEX IF NOT EXISTS idx_city_monthly_domain ON city_monthly_metrics(domain, metric, month);
CREATE INDEX IF NOT EXISTS idx_city_monthly_city   ON city_monthly_metrics(city_id, domain);

-- ============================================
-- CITY EMBEDDINGS (pgvector)
-- ============================================
CREATE TABLE IF NOT EXISTS city_embeddings (
    id          VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    city_id     VARCHAR(36) NOT NULL UNIQUE REFERENCES cities(id) ON DELETE CASCADE,
    vector      vector(1536) NOT NULL,
    tags        JSONB,
    computed_at TIMESTAMP NOT NULL DEFAULT now()
);

-- HNSW index for fast approximate nearest neighbor search
CREATE INDEX IF NOT EXISTS idx_city_embeddings_hnsw
    ON city_embeddings USING hnsw (vector vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

-- ============================================
-- USER TRAVEL PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS user_travel_profiles (
    id                 VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id            VARCHAR(36) NOT NULL UNIQUE,
    budget_tier        VARCHAR(20),
    preferred_climates JSONB,
    safety_requirement SMALLINT,
    nature_vs_culture  REAL,
    passports          JSONB,
    activity_weights   JSONB,
    vibe_weights       JSONB,
    preference_vector  JSONB,
    created_at         TIMESTAMP NOT NULL DEFAULT now(),
    updated_at         TIMESTAMP NOT NULL DEFAULT now()
);

-- ============================================
-- WIKIVOYAGE CATALOG (existing tables)
-- ============================================
CREATE TABLE IF NOT EXISTS wv_destinos (
    id              SERIAL PRIMARY KEY,
    destino_id      INTEGER UNIQUE,
    titulo          VARCHAR(500),
    resume          TEXT,
    imagem_url      VARCHAR(500),
    slug            VARCHAR(500),
    lang            VARCHAR(8),
    latitude        REAL,
    longitude       REAL,
    continente      VARCHAR(80),
    pais            VARCHAR(120),
    pais_code       VARCHAR(8),
    created_at      TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wv_destinos_hero (
    id              SERIAL PRIMARY KEY,
    destino_id      INTEGER NOT NULL,
    hero_url        VARCHAR(500),
    hero_alt        VARCHAR(500),
    source          VARCHAR(50),
    created_at      TIMESTAMP NOT NULL DEFAULT now()
);

-- ============================================
-- DESTINATION VENUES
-- ============================================
CREATE TABLE IF NOT EXISTS destination_venues (
    id           VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    destino_id   INTEGER NOT NULL,
    venue_id     VARCHAR(32) NOT NULL,
    city_id      VARCHAR(36) REFERENCES cities(id) ON DELETE SET NULL,
    source       VARCHAR(20) NOT NULL,
    name         VARCHAR(255) NOT NULL,
    address      TEXT,
    city         VARCHAR(200) NOT NULL,
    country      VARCHAR(120) NOT NULL,
    latitude     REAL NOT NULL,
    longitude    REAL NOT NULL,
    cuisine      VARCHAR(500),
    price_range  SMALLINT,
    rating       REAL NOT NULL,
    review_count INTEGER NOT NULL DEFAULT 0,
    award        VARCHAR(50),
    phone        VARCHAR(50),
    website      VARCHAR(500),
    url          VARCHAR(500),
    created_at   TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE(destino_id, venue_id)
);

CREATE INDEX IF NOT EXISTS idx_destination_venues_destino ON destination_venues(destino_id);
CREATE INDEX IF NOT EXISTS idx_destination_venues_source ON destination_venues(source);
CREATE INDEX IF NOT EXISTS idx_destination_venues_city   ON destination_venues(city_id);
