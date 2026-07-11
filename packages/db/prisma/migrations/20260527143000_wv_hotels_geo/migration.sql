-- Geo + enrichment fields for map search and Google Places worker
ALTER TABLE "wv_hotels" ADD COLUMN IF NOT EXISTS "latitude" REAL;
ALTER TABLE "wv_hotels" ADD COLUMN IF NOT EXISTS "longitude" REAL;
ALTER TABLE "wv_hotels" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "wv_hotels" ADD COLUMN IF NOT EXISTS "image_url" TEXT;
ALTER TABLE "wv_hotels" ADD COLUMN IF NOT EXISTS "google_place_id" VARCHAR(128);
ALTER TABLE "wv_hotels" ADD COLUMN IF NOT EXISTS "wikidata_id" VARCHAR(32);

CREATE INDEX IF NOT EXISTS "wv_hotels_latitude_longitude_idx" ON "wv_hotels"("latitude", "longitude");
