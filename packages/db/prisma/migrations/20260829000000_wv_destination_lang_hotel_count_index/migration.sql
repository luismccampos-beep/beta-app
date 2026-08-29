-- Index for GET /api/ai/recommended-destinations:
--   WHERE lang = ? AND hotel_count > 0 ORDER BY hotel_count DESC LIMIT 120
-- Previously a sequential scan on every homepage request.
CREATE INDEX IF NOT EXISTS "wv_destinations_lang_hotel_count_idx"
  ON "wv_destinations"("lang", "hotel_count" DESC);
