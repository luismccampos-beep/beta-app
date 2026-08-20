-- ============================================================================
-- DB hardening — applied 2026-08-20 (recommendations batch)
-- ----------------------------------------------------------------------------
--  1. Partial unique indexes for soft-deleted rows (WHERE deleted_at IS NULL)
--  2. FK index audit (Postgres does NOT auto-index FK columns)
--  3. Money: Float (real4) -> fixed-precision DECIMAL to avoid rounding bugs
--  4. Drop redundant `location_latlon` JSON columns (PostGIS GiST stays)
--  5. Drop legacy @@ignore UI-config tables (documented in
--     20260618153000_mark_deprecated_models_ignored)
--  9. Hash reset/verification tokens at rest (SHA-256)
-- 10. `set_updated_at()` trigger for raw-SQL writers (Prisma @updatedAt also
--     covered; triggers are belt-and-suspenders for non-Prisma writes)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Partial unique indexes
-- ----------------------------------------------------------------------------
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_email_key";
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_username_key";
ALTER TABLE "destinations" DROP CONSTRAINT IF EXISTS "destinations_slug_key";
ALTER TABLE "packages" DROP CONSTRAINT IF EXISTS "packages_slug_key";
ALTER TABLE "providers" DROP CONSTRAINT IF EXISTS "providers_slug_key";
ALTER TABLE "services" DROP CONSTRAINT IF EXISTS "services_slug_key";
ALTER TABLE "promotions" DROP CONSTRAINT IF EXISTS "promotions_code_key";
ALTER TABLE "payment_transactions" DROP CONSTRAINT IF EXISTS "payment_transactions_transaction_id_key";
ALTER TABLE "saved_itineraries" DROP CONSTRAINT IF EXISTS "saved_itineraries_slug_key";
ALTER TABLE "saved_itineraries" DROP CONSTRAINT IF EXISTS "saved_itineraries_share_code_key";
ALTER TABLE "bookings" DROP CONSTRAINT IF EXISTS "bookings_booking_reference_key";

-- Prisma cannot express partial unique indexes; enforce in SQL instead.
-- Keep a plain (non-unique) btree per schema @@index for row lookups.
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_active_key"
  ON "users"("email") WHERE "deleted_at" IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "users_username_active_key"
  ON "users"("username") WHERE "deleted_at" IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "destinations_slug_active_key"
  ON "destinations"("slug") WHERE "deleted_at" IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "packages_slug_active_key"
  ON "packages"("slug") WHERE "deleted_at" IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "providers_slug_active_key"
  ON "providers"("slug") WHERE "deleted_at" IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "services_slug_active_key"
  ON "services"("slug") WHERE "deleted_at" IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "promotions_code_active_key"
  ON "promotions"("code") WHERE "deleted_at" IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "payment_transactions_transaction_id_active_key"
  ON "payment_transactions"("transaction_id") WHERE "deleted_at" IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "saved_itineraries_slug_active_key"
  ON "saved_itineraries"("slug") WHERE "deleted_at" IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "saved_itineraries_share_code_active_key"
  ON "saved_itineraries"("share_code") WHERE "deleted_at" IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "bookings_booking_reference_active_key"
  ON "bookings"("booking_reference") WHERE "deleted_at" IS NULL;

-- ----------------------------------------------------------------------------
-- 2. FK index audit (non-unique btree per schema @@index)
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users"("email");
CREATE INDEX IF NOT EXISTS "users_username_idx" ON "users"("username");
CREATE INDEX IF NOT EXISTS "users_agency_id_idx" ON "users"("agency_id");
CREATE INDEX IF NOT EXISTS "providers_slug_idx" ON "providers"("slug");
CREATE INDEX IF NOT EXISTS "services_slug_idx" ON "services"("slug");
CREATE INDEX IF NOT EXISTS "flight_bookings_booking_id_idx" ON "flight_bookings"("booking_id");
CREATE INDEX IF NOT EXISTS "flight_bookings_flight_id_idx" ON "flight_bookings"("flight_id");
CREATE INDEX IF NOT EXISTS "hotel_bookings_booking_id_idx" ON "hotel_bookings"("booking_id");
CREATE INDEX IF NOT EXISTS "hotel_bookings_room_id_idx" ON "hotel_bookings"("room_id");
CREATE INDEX IF NOT EXISTS "service_bookings_booking_id_idx" ON "service_bookings"("booking_id");
CREATE INDEX IF NOT EXISTS "service_bookings_service_id_idx" ON "service_bookings"("service_id");
CREATE INDEX IF NOT EXISTS "cruise_bookings_booking_id_idx" ON "cruise_bookings"("booking_id");
CREATE INDEX IF NOT EXISTS "cruise_bookings_cruise_id_idx" ON "cruise_bookings"("cruise_id");
CREATE INDEX IF NOT EXISTS "transfer_bookings_booking_id_idx" ON "transfer_bookings"("booking_id");
CREATE INDEX IF NOT EXISTS "voucher_usage_user_id_idx" ON "voucher_usage"("user_id");
CREATE INDEX IF NOT EXISTS "user_favorites_destination_id_idx" ON "user_favorites"("destination_id");
CREATE INDEX IF NOT EXISTS "reviews_attraction_id_idx" ON "reviews"("attraction_id");
CREATE INDEX IF NOT EXISTS "saved_itineraries_destination_id_idx" ON "saved_itineraries"("destination_id");
CREATE INDEX IF NOT EXISTS "saved_itineraries_slug_idx" ON "saved_itineraries"("slug");
CREATE INDEX IF NOT EXISTS "saved_itineraries_share_code_idx" ON "saved_itineraries"("share_code");
CREATE INDEX IF NOT EXISTS "trip_destinations_destination_id_idx" ON "trip_destinations"("destination_id");
CREATE INDEX IF NOT EXISTS "chat_participants_user_id_idx" ON "chat_participants"("user_id");
CREATE INDEX IF NOT EXISTS "chat_messages_user_id_idx" ON "chat_messages"("user_id");
CREATE INDEX IF NOT EXISTS "transfers_provider_id_idx" ON "transfers"("provider_id");
CREATE INDEX IF NOT EXISTS "bookings_booking_reference_idx" ON "bookings"("booking_reference");

-- ----------------------------------------------------------------------------
-- 3. Money -> fixed-precision DECIMAL
-- ----------------------------------------------------------------------------
ALTER TABLE "destinations"
  ALTER COLUMN "price_per_day" TYPE DECIMAL(10,2) USING "price_per_day"::numeric(10,2),
  ALTER COLUMN "price_per_night" TYPE DECIMAL(10,2) USING "price_per_night"::numeric(10,2);

ALTER TABLE "bookings"
  ALTER COLUMN "price_per_night" TYPE DECIMAL(12,2) USING "price_per_night"::numeric(12,2),
  ALTER COLUMN "subtotal" TYPE DECIMAL(12,2) USING "subtotal"::numeric(12,2),
  ALTER COLUMN "tax_amount" TYPE DECIMAL(12,2) USING "tax_amount"::numeric(12,2),
  ALTER COLUMN "discount_amount" TYPE DECIMAL(12,2) USING "discount_amount"::numeric(12,2),
  ALTER COLUMN "total_price" TYPE DECIMAL(12,2) USING "total_price"::numeric(12,2),
  ALTER COLUMN "refund_amount" TYPE DECIMAL(12,2) USING "refund_amount"::numeric(12,2);

ALTER TABLE "promotions"
  ALTER COLUMN "value" TYPE DECIMAL(10,2) USING "value"::numeric(10,2),
  ALTER COLUMN "min_purchase" TYPE DECIMAL(12,2) USING "min_purchase"::numeric(12,2);

-- ----------------------------------------------------------------------------
-- 4. Drop redundant location_latlon JSON columns (nothing reads them; the
--    canonical geometry is `location` geography(Point,4326) with GiST index)
-- ----------------------------------------------------------------------------
ALTER TABLE "destinations" DROP COLUMN IF EXISTS "location_latlon";
ALTER TABLE "attractions" DROP COLUMN IF EXISTS "location_latlon";

-- ----------------------------------------------------------------------------
-- 5. Drop legacy UI-config tables (marked @@ignore, no client code references;
--    FKs already dropped in 20260618143018_apply_schema_fixes)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS "cruise_fleet", "cruise_providers", "cruise_ships",
  "hotel_steps", "hotel_fleet", "hotel_providers",
  "activity_steps", "activity_fleet", "activity_providers",
  "gastronomy_steps", "gastronomy_fleet", "gastronomy_providers", "gastronomy_restaurants",
  "event_steps", "event_fleet", "event_providers", "event_offerings",
  "guide_steps", "guide_fleet", "guide_providers", "guide_offerings",
  "transfer_steps", "transfer_providers", "transfer_vehicles" CASCADE;

-- ----------------------------------------------------------------------------
-- 9. Hash tokens at rest (SHA-256 hex). Lookups hash the client-supplied token.
--    `length(...) <> 64` keeps this idempotent (64 hex chars = already hashed).
-- ----------------------------------------------------------------------------
UPDATE "email_verification_tokens"
  SET "token" = encode(sha256("token"::bytea), 'hex')
  WHERE "token" IS NOT NULL AND length("token") <> 64;

UPDATE "users"
  SET "password_reset_token" = encode(sha256("password_reset_token"::bytea), 'hex')
  WHERE "password_reset_token" IS NOT NULL AND length("password_reset_token") <> 64;

UPDATE "users"
  SET "email_verification_token" = encode(sha256("email_verification_token"::bytea), 'hex')
  WHERE "email_verification_token" IS NOT NULL AND length("email_verification_token") <> 64;

UPDATE "users"
  SET "forgot_password_token" = encode(sha256("forgot_password_token"::bytea), 'hex')
  WHERE "forgot_password_token" IS NOT NULL AND length("forgot_password_token") <> 64;

-- ----------------------------------------------------------------------------
-- 10. updated_at triggers for raw-SQL writers
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION "set_updated_at"()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updated_at" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- users has no updated_at column; its @updatedAt field is `last_active`.
CREATE OR REPLACE FUNCTION "set_last_active"()
RETURNS TRIGGER AS $$
BEGIN
  NEW."last_active" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS "trg_users_last_active" ON "users";
CREATE TRIGGER "trg_users_last_active"
  BEFORE UPDATE ON "users" FOR EACH ROW EXECUTE FUNCTION "set_last_active"();

DROP TRIGGER IF EXISTS "trg_destinations_updated_at" ON "destinations";
CREATE TRIGGER "trg_destinations_updated_at"
  BEFORE UPDATE ON "destinations" FOR EACH ROW EXECUTE FUNCTION "set_updated_at"();

DROP TRIGGER IF EXISTS "trg_packages_updated_at" ON "packages";
CREATE TRIGGER "trg_packages_updated_at"
  BEFORE UPDATE ON "packages" FOR EACH ROW EXECUTE FUNCTION "set_updated_at"();

DROP TRIGGER IF EXISTS "trg_providers_updated_at" ON "providers";
CREATE TRIGGER "trg_providers_updated_at"
  BEFORE UPDATE ON "providers" FOR EACH ROW EXECUTE FUNCTION "set_updated_at"();

DROP TRIGGER IF EXISTS "trg_services_updated_at" ON "services";
CREATE TRIGGER "trg_services_updated_at"
  BEFORE UPDATE ON "services" FOR EACH ROW EXECUTE FUNCTION "set_updated_at"();

DROP TRIGGER IF EXISTS "trg_bookings_updated_at" ON "bookings";
CREATE TRIGGER "trg_bookings_updated_at"
  BEFORE UPDATE ON "bookings" FOR EACH ROW EXECUTE FUNCTION "set_updated_at"();

DROP TRIGGER IF EXISTS "trg_payment_transactions_updated_at" ON "payment_transactions";
CREATE TRIGGER "trg_payment_transactions_updated_at"
  BEFORE UPDATE ON "payment_transactions" FOR EACH ROW EXECUTE FUNCTION "set_updated_at"();

DROP TRIGGER IF EXISTS "trg_promotions_updated_at" ON "promotions";
CREATE TRIGGER "trg_promotions_updated_at"
  BEFORE UPDATE ON "promotions" FOR EACH ROW EXECUTE FUNCTION "set_updated_at"();

DROP TRIGGER IF EXISTS "trg_trips_updated_at" ON "trips";
CREATE TRIGGER "trg_trips_updated_at"
  BEFORE UPDATE ON "trips" FOR EACH ROW EXECUTE FUNCTION "set_updated_at"();

DROP TRIGGER IF EXISTS "trg_itineraries_updated_at" ON "itineraries";
CREATE TRIGGER "trg_itineraries_updated_at"
  BEFORE UPDATE ON "itineraries" FOR EACH ROW EXECUTE FUNCTION "set_updated_at"();

DROP TRIGGER IF EXISTS "trg_hotels_updated_at" ON "hotels";
CREATE TRIGGER "trg_hotels_updated_at"
  BEFORE UPDATE ON "hotels" FOR EACH ROW EXECUTE FUNCTION "set_updated_at"();

DROP TRIGGER IF EXISTS "trg_accommodations_updated_at" ON "accommodations";
CREATE TRIGGER "trg_accommodations_updated_at"
  BEFORE UPDATE ON "accommodations" FOR EACH ROW EXECUTE FUNCTION "set_updated_at"();