-- ============================================================================
-- Retention cleanup for high-write tables
-- ----------------------------------------------------------------------------
-- Bounds growth of tables that accumulate rows on every request/user action.
-- Intended to run on a schedule (e.g. cron / pg_cron / Cloudflare Cron Trigger
-- hitting a maintenance worker). Re-run freely — all deletes are idempotent.
--
-- THRESHOLDS (tune per environment; prod is stricter than dev):
--   sessions          -> revoke+purge expired sessions (30d) and revoked ones (7d)
--   audit_logs        -> 365 days
--   place_search_logs -> 30 days
--   notifications     -> 90 days once read/dismissed
--
-- For very large volumes (100M+ rows) consider LIST/PARTITION BY RANGE on the
-- time column instead of pure DELETE: `ALTER TABLE <t> ATTACH PARTITION ...`
-- plus `DROP TABLE <t>_<period>` is O(0) instead of a long vacuum.
-- ============================================================================

-- Purge expired sessions that were never revoked (invalidate dead auth state)
DELETE FROM "sessions"
WHERE "expires_at" < now() - interval '30 days';

-- Purge revoked sessions shortly after they are revoked (session kill + cleanup)
DELETE FROM "sessions"
WHERE "is_revoked" = true AND "revoked_at" < now() - interval '7 days';

-- Audit trail retention (GDPR/LGPD also implies right-to-erasure records)
DELETE FROM "audit_logs"
WHERE "created_at" < now() - interval '365 days';

-- Place search telemetry (external API perf monitoring) — keep a short window
DELETE FROM "place_search_logs"
WHERE "created_at" < now() - interval '30 days';

-- Notifications already consumed by the user
DELETE FROM "notifications"
WHERE ("read" = true OR "dismissed" = true)
  AND "created_at" < now() - interval '90 days';