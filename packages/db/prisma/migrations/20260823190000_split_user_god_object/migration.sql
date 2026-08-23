-- Migration: Split User god-object into User + UserProfile + UserGamification
-- The User model had ~50+ fields covering auth, profile, preferences, GDPR, and gamification.
-- This splits profile/preferences/GDPR into user_profiles and gamification into user_gamification.

-- 1. Create user_profiles table
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "avatar" TEXT,
    "avatar_thumbnail" TEXT,
    "avatar_url" TEXT,
    "bio" TEXT,
    "location" VARCHAR(255),
    "phone" VARCHAR(20),
    "birth_date" DATE,
    "gender" VARCHAR(20),
    "tax_id" VARCHAR(50),
    "address" VARCHAR(255),
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "country" VARCHAR(100),
    "postal_code" VARCHAR(20),
    "preferred_currency" "Currency" NOT NULL DEFAULT 'BRL',
    "preferred_language" VARCHAR(10) DEFAULT 'pt-PT',
    "travel_frequency" "TravelFrequency" NOT NULL DEFAULT 'OCCASIONAL',
    "timezone" VARCHAR(50),
    "theme" VARCHAR(20),
    "terms_accepted" BOOLEAN NOT NULL DEFAULT false,
    "privacy_accepted" BOOLEAN NOT NULL DEFAULT false,
    "accepted_terms_date" TIMESTAMP(3),
    "accepted_privacy_date" TIMESTAMP(3),
    "marketing_opt_in" BOOLEAN NOT NULL DEFAULT false,
    "data_processing_opt_in" BOOLEAN NOT NULL DEFAULT false,
    "data_retention_consent" BOOLEAN NOT NULL DEFAULT false,
    "gdpr_consent" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- Unique constraint on user_id
CREATE UNIQUE INDEX "user_profiles_user_id_key" ON "user_profiles"("user_id");
CREATE INDEX "user_profiles_user_id_idx" ON "user_profiles"("user_id");
CREATE INDEX "user_profiles_deleted_at_idx" ON "user_profiles"("deleted_at");
CREATE INDEX "user_profiles_phone_idx" ON "user_profiles"("phone");
CREATE INDEX "user_profiles_tax_id_idx" ON "user_profiles"("tax_id");

-- Foreign key
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 2. Create user_gamification table
CREATE TABLE "user_gamification" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "profile_completion" SMALLINT NOT NULL DEFAULT 0,
    "experience_points" INTEGER NOT NULL DEFAULT 0,
    "streak_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "user_gamification_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "user_gamification_user_id_key" ON "user_gamification"("user_id");
CREATE INDEX "user_gamification_user_id_idx" ON "user_gamification"("user_id");
CREATE INDEX "user_gamification_deleted_at_idx" ON "user_gamification"("deleted_at");

ALTER TABLE "user_gamification" ADD CONSTRAINT "user_gamification_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 3. Migrate data from users → user_profiles
INSERT INTO "user_profiles" (
    "user_id", "avatar", "avatar_thumbnail", "avatar_url", "bio", "location",
    "phone", "birth_date", "gender", "tax_id", "address", "city", "state",
    "country", "postal_code", "preferred_currency", "preferred_language",
    "travel_frequency", "timezone", "theme", "terms_accepted", "privacy_accepted",
    "accepted_terms_date", "accepted_privacy_date", "marketing_opt_in",
    "data_processing_opt_in", "data_retention_consent", "gdpr_consent",
    "created_at", "updated_at"
)
SELECT
    "id", "avatar", "avatar_thumbnail", "avatar_url", "bio", "location",
    "phone", "birth_date", "gender", "tax_id", "address", "city", "state",
    "country", "postal_code", "preferred_currency", "preferred_language",
    "travel_frequency", "timezone", "theme", "terms_accepted", "privacy_accepted",
    "accepted_terms_date", "accepted_privacy_date", "marketing_opt_in",
    "data_processing_opt_in", "data_retention_consent", "gdpr_consent",
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "users";

-- 4. Migrate data from users → user_gamification
INSERT INTO "user_gamification" (
    "user_id", "profile_completion", "experience_points", "streak_count",
    "created_at", "updated_at"
)
SELECT
    "id", "profile_completion", "experience_points", "streak_count",
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "users";

-- 5. Drop old indexes on users for columns that moved to user_profiles
DROP INDEX IF EXISTS "users_phone_idx";
DROP INDEX IF EXISTS "users_tax_id_idx";

-- 6. Drop moved columns from users
ALTER TABLE "users" DROP COLUMN IF EXISTS "avatar";
ALTER TABLE "users" DROP COLUMN IF EXISTS "avatar_thumbnail";
ALTER TABLE "users" DROP COLUMN IF EXISTS "avatar_url";
ALTER TABLE "users" DROP COLUMN IF EXISTS "bio";
ALTER TABLE "users" DROP COLUMN IF EXISTS "location";
ALTER TABLE "users" DROP COLUMN IF EXISTS "phone";
ALTER TABLE "users" DROP COLUMN IF EXISTS "birth_date";
ALTER TABLE "users" DROP COLUMN IF EXISTS "gender";
ALTER TABLE "users" DROP COLUMN IF EXISTS "tax_id";
ALTER TABLE "users" DROP COLUMN IF EXISTS "address";
ALTER TABLE "users" DROP COLUMN IF EXISTS "city";
ALTER TABLE "users" DROP COLUMN IF EXISTS "state";
ALTER TABLE "users" DROP COLUMN IF EXISTS "country";
ALTER TABLE "users" DROP COLUMN IF EXISTS "postal_code";
ALTER TABLE "users" DROP COLUMN IF EXISTS "preferred_currency";
ALTER TABLE "users" DROP COLUMN IF EXISTS "preferred_language";
ALTER TABLE "users" DROP COLUMN IF EXISTS "travel_frequency";
ALTER TABLE "users" DROP COLUMN IF EXISTS "timezone";
ALTER TABLE "users" DROP COLUMN IF EXISTS "theme";
ALTER TABLE "users" DROP COLUMN IF EXISTS "terms_accepted";
ALTER TABLE "users" DROP COLUMN IF EXISTS "privacy_accepted";
ALTER TABLE "users" DROP COLUMN IF EXISTS "accepted_terms_date";
ALTER TABLE "users" DROP COLUMN IF EXISTS "accepted_privacy_date";
ALTER TABLE "users" DROP COLUMN IF EXISTS "marketing_opt_in";
ALTER TABLE "users" DROP COLUMN IF EXISTS "data_processing_opt_in";
ALTER TABLE "users" DROP COLUMN IF EXISTS "data_retention_consent";
ALTER TABLE "users" DROP COLUMN IF EXISTS "gdpr_consent";
ALTER TABLE "users" DROP COLUMN IF EXISTS "profile_completion";
ALTER TABLE "users" DROP COLUMN IF EXISTS "experience_points";
ALTER TABLE "users" DROP COLUMN IF EXISTS "streak_count";
