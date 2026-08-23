-- ============================================================================
-- Composite indexes, soft-delete coverage, GDPR fields, and triggers
-- Applied 2026-08-23
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Composite indexes for common query patterns
-- ----------------------------------------------------------------------------

-- Active users by role (dashboard user listing)
CREATE INDEX IF NOT EXISTS "users_status_role_idx"
  ON "users"("status", "role", "join_date") WHERE "deleted_at" IS NULL;

-- Pending bookings by date (operations dashboard)
CREATE INDEX IF NOT EXISTS "bookings_status_date_idx"
  ON "bookings"("booking_status", "start_date") WHERE "deleted_at" IS NULL;

-- User's unread notifications (notification badge)
CREATE INDEX IF NOT EXISTS "notifications_user_read_idx"
  ON "notifications"("user_id", "read", "created_at");

-- Reviews awaiting moderation
CREATE INDEX IF NOT EXISTS "reviews_moderation_idx"
  ON "reviews"("review_status", "created_at") WHERE "deleted_at" IS NULL;

-- Articles by category + status (CMS listing)
CREATE INDEX IF NOT EXISTS "articles_category_status_idx"
  ON "articles"("category", "status", "published_at");

-- Trips by user + status (user dashboard)
CREATE INDEX IF NOT EXISTS "trips_user_status_idx"
  ON "trips"("user_id", "status");

-- Rewards / loyalty look-ups by user
CREATE INDEX IF NOT EXISTS "loyalty_transactions_program_date_idx"
  ON "loyalty_transactions"("loyalty_program_id", "created_at");

-- AI conversations by user + status (support queue)
CREATE INDEX IF NOT EXISTS "ai_conversations_user_status_idx"
  ON "ai_conversations"("user_id", "conversation_status");

-- Chat messages by room + timestamp (chat history pagination)
CREATE INDEX IF NOT EXISTS "chat_messages_room_created_idx"
  ON "chat_messages"("room_id", "created_at");

-- Preference events by user + type (analytics)
CREATE INDEX IF NOT EXISTS "preference_events_user_type_idx"
  ON "preference_events"("user_id", "preference_type");

-- ----------------------------------------------------------------------------
-- 2. RoomMessage: unify soft-delete (deleted_at replaces deleted boolean)
-- ----------------------------------------------------------------------------
-- Backfill: set deleted_at for any row where deleted=true but deleted_at is NULL
UPDATE "chat_messages"
  SET "deleted_at" = NOW()
  WHERE "deleted" = true AND "deleted_at" IS NULL;

-- Drop the redundant boolean — the soft-delete proxy uses only deleted_at
ALTER TABLE "chat_messages" DROP COLUMN IF EXISTS "deleted";

-- ----------------------------------------------------------------------------
-- 3. GDPR / right-to-erasure: add deletedAt to AI and loyalty models
-- ----------------------------------------------------------------------------
ALTER TABLE "ai_conversations" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMP(3);
ALTER TABLE "ai_messages" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMP(3);
ALTER TABLE "loyalty_programs" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMP(3);

-- Indexes for soft-delete proxy efficiency
CREATE INDEX IF NOT EXISTS "ai_conversations_deleted_at_idx" ON "ai_conversations"("deleted_at");
CREATE INDEX IF NOT EXISTS "ai_messages_deleted_at_idx" ON "ai_messages"("deleted_at");
CREATE INDEX IF NOT EXISTS "loyalty_programs_deleted_at_idx" ON "loyalty_programs"("deleted_at");

-- ----------------------------------------------------------------------------
-- 4. EmailNotification: add FK to users with CASCADE
-- ----------------------------------------------------------------------------
-- Clean orphans before creating the FK constraint
DELETE FROM "email_notifications"
  WHERE "user_id" IS NOT NULL
    AND "user_id" NOT IN (SELECT "id" FROM "users");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'email_notifications_user_id_fkey'
  ) THEN
    ALTER TABLE "email_notifications"
      ADD CONSTRAINT "email_notifications_user_id_fkey"
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
  END IF;
END;
$$;

-- ----------------------------------------------------------------------------
-- 5. updated_at triggers — all tables with updated_at that don't have one yet
-- ----------------------------------------------------------------------------
-- The function set_updated_at() already exists from migration 20260820000000.

DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOR tbl IN
        SELECT t.table_name
        FROM information_schema.columns c
        JOIN information_schema.tables t
          ON t.table_name = c.table_name AND t.table_schema = c.table_schema
        WHERE c.column_name = 'updated_at'
          AND c.table_schema = 'public'
          AND t.table_type = 'BASE TABLE'
          AND c.table_name NOT IN (
            -- Tables that already have triggers (from 20260820000000)
            'destinations', 'packages', 'providers', 'services',
            'bookings', 'payment_transactions', 'promotions', 'trips',
            'itineraries', 'hotels', 'accommodations'
          )
    LOOP
        EXECUTE format(
            'DROP TRIGGER IF EXISTS %I ON %I;
             CREATE TRIGGER %I BEFORE UPDATE ON %I
             FOR EACH ROW EXECUTE FUNCTION set_updated_at()',
            'trg_' || tbl || '_updated_at', tbl,
            'trg_' || tbl || '_updated_at', tbl
        );
    END LOOP;
END;
$$;