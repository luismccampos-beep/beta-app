-- ============================================================================
-- CRM composite indexes + Favorite/UserFavorite consolidation
-- Applied 2026-08-23
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Composite indexes on CRM models
-- ----------------------------------------------------------------------------

-- Client: name search within agency, recent clients
CREATE INDEX IF NOT EXISTS "clients_agency_name_idx"
  ON "clients"("agency_id", "name");
CREATE INDEX IF NOT EXISTS "clients_agency_created_idx"
  ON "clients"("agency_id", "created_at");

-- Lead: pipeline view (agency + status), recent leads
CREATE INDEX IF NOT EXISTS "leads_agency_status_idx"
  ON "leads"("agency_id", "status");
CREATE INDEX IF NOT EXISTS "leads_agency_created_idx"
  ON "leads"("agency_id", "created_at");

-- Review: public review pages (destination + status), user history
CREATE INDEX IF NOT EXISTS "reviews_destination_status_idx"
  ON "reviews"("destination_id", "review_status") WHERE "deleted_at" IS NULL;
CREATE INDEX IF NOT EXISTS "reviews_user_created_idx"
  ON "reviews"("user_id", "created_at");

-- Invoice: no indexes existed at all
CREATE INDEX IF NOT EXISTS "invoices_booking_id_idx"
  ON "invoices"("booking_id");
CREATE INDEX IF NOT EXISTS "invoices_status_idx"
  ON "invoices"("status");
CREATE INDEX IF NOT EXISTS "invoices_issue_date_idx"
  ON "invoices"("issue_date");

-- RefundRequest: no indexes existed at all
CREATE INDEX IF NOT EXISTS "refund_requests_booking_id_idx"
  ON "refund_requests"("booking_id");
CREATE INDEX IF NOT EXISTS "refund_requests_invoice_id_idx"
  ON "refund_requests"("invoice_id");
CREATE INDEX IF NOT EXISTS "refund_requests_status_idx"
  ON "refund_requests"("status");

-- AdminTransaction: no indexes existed at all
CREATE INDEX IF NOT EXISTS "admin_transactions_invoice_id_idx"
  ON "admin_transactions"("invoice_id");
CREATE INDEX IF NOT EXISTS "admin_transactions_status_idx"
  ON "admin_transactions"("status");

-- ----------------------------------------------------------------------------
-- 2. Consolidate Favorite + UserFavorite → Favorite
-- ----------------------------------------------------------------------------
-- Steps:
--   a) Add new columns to `favorites` (destination_id, priority, notes)
--   b) Copy rows from `user_favorites` into `favorites` as itemType='destination'
--   c) Drop `user_favorites` table
--   d) Add FK constraint and index on favorites.destination_id

-- a) Add columns to favorites
ALTER TABLE "favorites"
  ADD COLUMN IF NOT EXISTS "destination_id" INTEGER,
  ADD COLUMN IF NOT EXISTS "priority" SMALLINT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "notes" TEXT;

-- b) Migrate data from user_favorites into favorites
INSERT INTO "favorites" ("id", "user_id", "item_type", "item_id", "destination_id", "priority", "notes", "created_at", "updated_at")
SELECT
  gen_random_uuid()::text,
  uf."user_id",
  'destination',
  uf."destination_id"::text,
  uf."destination_id",
  uf."priority",
  uf."notes",
  uf."created_at",
  uf."updated_at"
FROM "user_favorites" uf
WHERE NOT EXISTS (
  SELECT 1 FROM "favorites" f
  WHERE f."user_id" = uf."user_id"
    AND f."item_type" = 'destination'
    AND f."item_id" = uf."destination_id"::text
);

-- c) Drop user_favorites (FKs to users/destinations will cascade)
DROP TABLE IF EXISTS "user_favorites" CASCADE;

-- d) FK constraint + indexes on the new destination_id column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'favorites_destination_id_fkey'
  ) THEN
    ALTER TABLE "favorites"
      ADD CONSTRAINT "favorites_destination_id_fkey"
      FOREIGN KEY ("destination_id") REFERENCES "destinations"("id")
      ON DELETE SET NULL;
  END IF;
END;
$$;

CREATE INDEX IF NOT EXISTS "favorites_destination_id_idx"
  ON "favorites"("destination_id");
CREATE INDEX IF NOT EXISTS "favorites_user_created_idx"
  ON "favorites"("user_id", "created_at");
