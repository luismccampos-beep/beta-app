# Prisma migrations

This monorepo applies migrations with `prisma migrate deploy` (see `npm run db:migrate`).
Local Postgres runs on port **5433**; if it is down, do NOT run `prisma migrate dev`
(requires a shadow DB). Hand-write the `migration.sql` and keep `schema.prisma` in sync
manually instead — `migrate deploy` only applies SQL, so a hand-written migration is
prod-safe.

## History & baseline plan

- `20260513144557_init_postgres` — original full schema (contains drift: e.g. `users_phone_key`
  was created then removed from the schema; still present in some DBs).
- `20260526121752_travel_wikivoyage_catalog` … `20260528120000_wv_hotel_reviews` — catalog tables.
- `20260616161214_init` — partial re-baseline.
- `20260618143018_apply_schema_fixes` — dropped many FKs; paved the way for table removals.
- `20260618150537_add_indexes_and_amenity_tables` — indexes + `hotel_amenities`.
- `20260618153000_mark_deprecated_models_ignored` — **documentation only**; the Step/Fleet/
  Provider/Offering tables were NOT dropped here.
- `20260623120000_add_database_foreign_keys` — re-added real FKs (`relationMode = "foreignKeys"`).
- `20260624150000_add_performance_indexes` / `20260624155000_normalize_map_snake_case` — index &
  naming pass (normalize **dropped** `payments`, `hotel_properties`, `activity_offerings`,
  `activities`, `crm_customers`, `crm_bookings`).
- `20260625100000_enable_postgis` — PostGIS extension + `geography(Point,4326)` columns and GiST
  indexes on `wv_hotels`, `wv_destinations`, `destinations`, `accommodations`.
- `20260625110000_destination_search_mv` … `20260625130000_add_destination_reviews` — search MV +
  destination reviews.
- `20260820000000_db_hardening_recommendations` — partial unique indexes, FK-index audit, money→
  DECIMAL, dropped redundant `location_latlon`, dropped the legacy `@@ignore` tables, hashed
  tokens at rest, added `updated_at` triggers.

### Squashing

When the migration chain stabilizes, squash the non-destructive part into a single baseline:

1. Create a fresh shadow DB and run `prisma migrate resolve --applied` for every migration
   up to the squash point.
2. `prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script`
   to produce a `0000_squashed_baseline/migration.sql`.
3. Delete the pre-squash folders and re-`migrate deploy` on prod — verify with
   `prisma migrate status` and a `prisma migrate diff` against a fresh clone.

Keep this README updated on every structural change. New fields must keep the snake_case
`@map` convention and `Decimal` for money (see schema datasource comment for pooling rules).