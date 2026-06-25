-- Performance Indexes for Travel Catalog
-- Adds trigram search, composite indexes, and partial indexes
-- for the most frequent query patterns.

-- 1. Enable pg_trgm extension for fuzzy text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Destination text search (ILIKE on nome)
CREATE INDEX CONCURRENTLY IF NOT EXISTS wv_destinations_nome_trgm
  ON wv_destinations USING gin (nome gin_trgm_ops);

-- 3. Destination filter indexes (frequent WHERE clauses)
CREATE INDEX CONCURRENTLY IF NOT EXISTS wv_destinations_pais_lang
  ON wv_destinations(pais, lang);
CREATE INDEX CONCURRENTLY IF NOT EXISTS wv_destinations_slug_lang
  ON wv_destinations(slug, lang);

-- 4. Hotels nearby (geo bounding box)
CREATE INDEX CONCURRENTLY IF NOT EXISTS wv_hotels_geo
  ON wv_hotels(latitude, longitude)
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- 5. Hotels by destination + price (listing page)
CREATE INDEX CONCURRENTLY IF NOT EXISTS wv_hotels_destino_preco
  ON wv_hotels(destino_id, preco_por_noite);

-- 6. Flights by origin + destination (search)
CREATE INDEX CONCURRENTLY IF NOT EXISTS wv_flights_origem_destino
  ON wv_flights(origem, destino_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS wv_flights_preco
  ON wv_flights(preco);

-- 7. Reviews by destination + rating (top reviews)
CREATE INDEX CONCURRENTLY IF NOT EXISTS reviews_destination_rating
  ON reviews(destination_id, rating DESC)
  WHERE review_status = 'APPROVED';
