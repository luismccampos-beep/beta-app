-- Migration: Travel Intelligence tables
-- Countries, Cities, Metrics, Monthly Metrics, Embeddings, User Travel Profiles

CREATE TABLE IF NOT EXISTS countries (
    id              VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    iso2            VARCHAR(2) NOT NULL UNIQUE,
    iso3            VARCHAR(3) NOT NULL UNIQUE,
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

CREATE TABLE IF NOT EXISTS city_metrics (
    id          VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    city_id     VARCHAR(36) NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    domain      VARCHAR(30) NOT NULL,
    score       REAL NOT NULL,
    raw         JSONB,
    model_ver   VARCHAR(20),
    computed_at TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE(city_id, domain, model_ver)
);

CREATE INDEX IF NOT EXISTS idx_city_metrics_domain ON city_metrics(domain, score);

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

CREATE TABLE IF NOT EXISTS city_embeddings (
    id          VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    city_id     VARCHAR(36) NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    model_ver   VARCHAR(20) NOT NULL,
    vector      JSONB NOT NULL,
    tags        JSONB,
    computed_at TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE(city_id, model_ver)
);

CREATE INDEX IF NOT EXISTS idx_city_embeddings_model ON city_embeddings(model_ver);

CREATE TABLE IF NOT EXISTS user_travel_profiles (
    id                VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id           VARCHAR(36) NOT NULL UNIQUE,
    passport_country  VARCHAR(2),
    budget_ceiling    DECIMAL(8,2),
    travel_dates      JSONB,
    accessibility     JSONB,
    dietary_needs     JSONB,
    preferred_climate JSONB,
    activity_weights  JSONB,
    vibe_weights      JSONB,
    preference_vector JSONB,
    created_at        TIMESTAMP NOT NULL DEFAULT now(),
    updated_at        TIMESTAMP NOT NULL DEFAULT now()
);
