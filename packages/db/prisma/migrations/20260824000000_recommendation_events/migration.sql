-- Migration: RecommendationEvent (recommendation feedback loop)
-- Append-only impression/click/dismiss log for AI recommendations.
-- Consumed by tools/data-pipeline/scripts/export-db-signals.mjs to retrain
-- the recommender and to measure recommendation CTR per surface.

CREATE TABLE "recommendation_events" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "session_id" VARCHAR(64),
    "surface" VARCHAR(50) NOT NULL,
    "event_type" VARCHAR(20) NOT NULL,
    "item_id" VARCHAR(64) NOT NULL,
    "position" SMALLINT NOT NULL DEFAULT 0,
    "model" VARCHAR(50),
    "score" DOUBLE PRECISION,
    "metadata" JSONB,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recommendation_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "recommendation_events_user_id_created_at_idx" ON "recommendation_events"("user_id", "created_at");
CREATE INDEX "recommendation_events_item_id_event_type_idx" ON "recommendation_events"("item_id", "event_type");
CREATE INDEX "recommendation_events_surface_event_type_created_at_idx" ON "recommendation_events"("surface", "event_type", "created_at");
CREATE INDEX "recommendation_events_created_at_idx" ON "recommendation_events"("created_at");
