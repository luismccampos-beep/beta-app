-- Migration: User.lastActive fix + password-reset consolidation
-- 1. Remove redundant password-reset columns from users table
--    Auth code now uses the dedicated password_reset_tokens table instead.
-- 2. lastActive: removed @updatedAt from Prisma schema (was updating on every save).
--    The set_last_active() PostgreSQL trigger still handles DB-level updates.

-- Drop redundant password-reset columns (dead code + superseded by password_reset_tokens table)
ALTER TABLE "users" DROP COLUMN IF EXISTS "password_reset_token";
ALTER TABLE "users" DROP COLUMN IF EXISTS "password_reset_expires";
ALTER TABLE "users" DROP COLUMN IF EXISTS "forgot_password_token";
ALTER TABLE "users" DROP COLUMN IF EXISTS "forgot_password_token_expiry";
