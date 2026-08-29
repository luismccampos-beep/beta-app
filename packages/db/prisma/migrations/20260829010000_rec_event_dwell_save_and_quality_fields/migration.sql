-- Dwell + save-to-trip event types and per-destination quality labels.
-- eventType stays VARCHAR(20): 'dwell' (5) and 'save' (4) fit.
ALTER TABLE "recommendation_events" ADD COLUMN "dwell_seconds" INTEGER;
ALTER TABLE "recommendation_events" ADD COLUMN "dismiss_reason" VARCHAR(50);

COMMENT ON COLUMN "recommendation_events"."event_type" IS 'impression | click | dismiss | dwell | save';

-- Quality labels for destinations (best-of priors for ranking).
ALTER TABLE "wv_destinations" ADD COLUMN "quality_labels" JSONB;
ALTER TABLE "wv_destinations" ADD COLUMN "wikidata_sitelinks" INTEGER;

-- Seasonality: per-month visit suitability (0-100), from climate/crowd/price signals.
CREATE TABLE IF NOT EXISTS "destination_month_scores" (
    "id" SERIAL PRIMARY KEY,
    "destination_id" INTEGER NOT NULL REFERENCES "wv_destinations"("id") ON DELETE CASCADE,
    "month" SMALLINT NOT NULL CHECK ("month" BETWEEN 1 AND 12),
    "score" SMALLINT NOT NULL CHECK ("score" BETWEEN 0 AND 100),
    "crowd_index" REAL,
    "price_index" REAL,
    "sea_temp_c" REAL,
    CONSTRAINT "destination_month_scores_destination_id_month_key" UNIQUE ("destination_id", "month")
);

CREATE INDEX IF NOT EXISTS "destination_month_scores_destination_id_idx"
    ON "destination_month_scores"("destination_id");
CREATE INDEX IF NOT EXISTS "destination_month_scores_month_score_idx"
    ON "destination_month_scores"("month", "score" DESC);
