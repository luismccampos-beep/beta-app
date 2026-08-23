-- ============================================================================
-- deletedAt indexes + refundAmount type fix
-- Applied 2026-08-23
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. deletedAt indexes on soft-delete models
-- ----------------------------------------------------------------------------
-- The soft-delete proxy injects `deletedAt IS NULL` on every read query.
-- Without an index, Postgres does a sequential scan on every findMany/findFirst.

-- Users
CREATE INDEX IF NOT EXISTS "users_deleted_at_idx" ON "users"("deleted_at");

-- Community
CREATE INDEX IF NOT EXISTS "community_posts_deleted_at_idx" ON "community_posts"("deleted_at");
CREATE INDEX IF NOT EXISTS "community_comments_deleted_at_idx" ON "community_comments"("deleted_at");

-- Destinations
CREATE INDEX IF NOT EXISTS "destinations_deleted_at_idx" ON "destinations"("deleted_at");

-- Packages
CREATE INDEX IF NOT EXISTS "packages_deleted_at_idx" ON "packages"("deleted_at");

-- Providers
CREATE INDEX IF NOT EXISTS "providers_deleted_at_idx" ON "providers"("deleted_at");

-- Services
CREATE INDEX IF NOT EXISTS "services_deleted_at_idx" ON "services"("deleted_at");

-- Promotions
CREATE INDEX IF NOT EXISTS "promotions_deleted_at_idx" ON "promotions"("deleted_at");

-- Trips
CREATE INDEX IF NOT EXISTS "trips_deleted_at_idx" ON "trips"("deleted_at");

-- Saved itineraries
CREATE INDEX IF NOT EXISTS "saved_itineraries_deleted_at_idx" ON "saved_itineraries"("deleted_at");

-- Reviews
CREATE INDEX IF NOT EXISTS "reviews_deleted_at_idx" ON "reviews"("deleted_at");

-- Chat messages (RoomMessage)
CREATE INDEX IF NOT EXISTS "chat_messages_deleted_at_idx" ON "chat_messages"("deleted_at");

-- Article comments
CREATE INDEX IF NOT EXISTS "article_comments_deleted_at_idx" ON "article_comments"("deleted_at");

-- CRM
CREATE INDEX IF NOT EXISTS "crm_categories_deleted_at_idx" ON "crm_categories"("deleted_at");
CREATE INDEX IF NOT EXISTS "crm_products_deleted_at_idx" ON "crm_products"("deleted_at");

-- ----------------------------------------------------------------------------
-- 2. Fix PaymentTransaction.refundAmount: VARCHAR(20) → DECIMAL(12,2)
-- ----------------------------------------------------------------------------
-- Backfill: try to cast existing values; unparseable rows get NULL.
ALTER TABLE "payment_transactions"
  ADD COLUMN IF NOT EXISTS "refund_amount_new" DECIMAL(12, 2);

UPDATE "payment_transactions"
  SET "refund_amount_new" = "refund_amount"::numeric(12, 2)
  WHERE "refund_amount" IS NOT NULL
    AND "refund_amount" ~ '^[0-9]+(\.[0-9]+)?$';

ALTER TABLE "payment_transactions" DROP COLUMN "refund_amount";
ALTER TABLE "payment_transactions" RENAME COLUMN "refund_amount_new" TO "refund_amount";
