-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add geography columns to existing tables
ALTER TABLE wv_hotels ADD COLUMN IF NOT EXISTS location geography(Point, 4326);
UPDATE wv_hotels SET location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL AND location IS NULL;
CREATE INDEX IF NOT EXISTS idx_wv_hotels_location ON wv_hotels USING GIST (location);

ALTER TABLE wv_destinations ADD COLUMN IF NOT EXISTS location geography(Point, 4326);
UPDATE wv_destinations SET location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL AND location IS NULL;
CREATE INDEX IF NOT EXISTS idx_wv_destinations_location ON wv_destinations USING GIST (location);

ALTER TABLE destinations ADD COLUMN IF NOT EXISTS location geography(Point, 4326);
UPDATE destinations SET location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL AND location IS NULL;
CREATE INDEX IF NOT EXISTS idx_destinations_location ON destinations USING GIST (location);

ALTER TABLE accommodations ADD COLUMN IF NOT EXISTS location geography(Point, 4326);
UPDATE accommodations SET location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL AND location IS NULL;
CREATE INDEX IF NOT EXISTS idx_accommodations_location ON accommodations USING GIST (location);
