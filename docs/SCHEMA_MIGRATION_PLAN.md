# Schema Migration Plan

## Overview
This document outlines the planned database schema migrations to address the issues identified in the codebase review. Each migration is designed to be backward-compatible and deployable incrementally.

## Priority 1: Critical Fixes (Safe to Deploy Immediately)

### 1.1 Booking.destinationId → nullable
**Problem**: `destinationId` is `NOT NULL` but flight-only bookings may not have a catalog destination.
**Migration**: 
```prisma
model Booking {
  destinationId String? @map("destination_id")
}
```
**Impact**: Low. Existing bookings all have a destination. New flight-only bookings can be `null`.
**SQL**: `ALTER TABLE bookings ALTER COLUMN destination_id DROP NOT NULL;`

### 1.2 User.phone → remove @unique
**Problem**: `@unique` on nullable phone prevents multiple users without phone and blocks agency employees sharing a phone.
**Migration**:
```prisma
model User {
  phone String? @db.VarChar(20)  // removed @unique
}
```
**Impact**: Low. Remove unique constraint, add regular index instead.
**SQL**: 
```sql
DROP INDEX IF EXISTS users_phone_key;
CREATE INDEX idx_users_phone ON users(phone);
```

### 1.3 WvHotel.precoPorNoite → Decimal
**Problem**: `Int` instead of `Decimal(10,2)`, inconsistent with all other price models.
**Migration**:
```prisma
model WvHotel {
  precoPorNoite Decimal @map("preco_por_noite") @db.Decimal(10, 2)
}
```
**Impact**: Low. Data migration: `preco_por_noite / 100.0` to convert cents to decimal.
**SQL**: 
```sql
ALTER TABLE wv_hotels ALTER COLUMN preco_por_noite TYPE DECIMAL(10,2) USING preco_por_noite::decimal / 100.0;
```

### 1.4 Missing indexes on wv_ tables
**Problem**: `wv_destinations.slug` has `@unique` but no explicit `@@index`. `wv_flights` indexes on `(origem, destinoId)` but queries filter by `(origem, destinoIata)`.
**Migration**:
```prisma
model WvDestination {
  @@index([slug])  // explicit index for clarity
}
model WvFlight {
  @@index([origem, destinoIata])
}
```
**SQL**:
```sql
CREATE INDEX IF NOT EXISTS idx_wv_destinations_slug ON wv_destinations(slug);
CREATE INDEX IF NOT EXISTS idx_wv_flights_origem_destino_iata ON wv_flights(origem, destino_iata);
```

## Priority 2: Model Cleanup (Requires Code Audit)

### 2.1 Remove duplicate accommodation models
**Problem**: `Accommodation`, `Hotel`, `WvHotel` all represent the same concept. Plus `HotelStep`, `HotelFleet`, `HotelProvider`, `HotelProperty` store UI text in DB.
**Proposed Solution**:
1. Keep `Hotel` as the canonical business model (has rooms, bookings, details)
2. Keep `WvHotel` as the Wikivoyage catalog (read-only, populated by scripts)
3. Remove `Accommodation` (generic, unused by business logic)
4. Remove `HotelStep`, `HotelFleet`, `HotelProvider`, `HotelProperty` (UI config → move to i18n/code)
5. Same pattern for `Cruise*`, `Activity*`, `Gastronomy*`, `Event*`, `Guide*`, `Transfer*` Step/Fleet/Provider/Offering models

**Migration Strategy**: 
- Phase 1: Mark models as `@@ignore` in schema (Prisma ignores them, tables stay in DB)
- Phase 2: After confirming no code references them, drop tables

### 2.2 Remove JSON fields duplicated by relations
**Problem**: `User.favoriteDestinations`, `User.friends`, `User.blockedUsers` are JSON blobs duplicated by `UserFavorite`, `UserFriend` relations.
**Migration**:
```prisma
model User {
  // Remove these fields:
  // favoriteDestinations Json? @map("favorite_destinations") @db.JsonB
  // friends              Json? @db.JsonB
  // blockedUsers         Json? @map("blocked_users") @db.JsonB
}
```
**Impact**: Requires code audit to ensure all reads use the relation models instead.

### 2.3 UserPreference.aiSettings → typed fields
**Problem**: `aiSettings Json?` stores all advanced preferences in an unvalidated blob, duplicating individual columns.
**Migration**: 
- Extract commonly-queried fields from `aiSettings` into typed columns
- Keep `aiSettings` as a legacy field but mark as deprecated
- Add validation layer for new typed fields

### 2.4 WvDestination ↔ Destination reconciliation
**Problem**: Two parallel destination catalogs with no foreign key.
**Migration**:
```prisma
model WvDestination {
  destinationId String? @map("destination_id")
  destination   Destination? @relation(fields: [destinationId], references: [id])
}
```
**Impact**: Requires a reconciliation script to match records by slug/iata/country+city.

## Priority 3: Payment model deduplication

### 3.1 Remove Payment model (duplicate of PaymentTransaction)
**Problem**: `Payment` and `PaymentTransaction` are identical models.
**Migration**: Mark `Payment` as `@@ignore` after migrating all code to use `PaymentTransaction`.

## Implementation Order

1. **Week 1**: Priority 1 fixes (safe, backward-compatible)
   - Booking.destinationId nullable
   - User.phone unique removal
   - WvHotel.precoPorNoite Decimal
   - Missing indexes
2. **Week 2**: Priority 2.1 (model cleanup - mark as @@ignore)
3. **Week 3**: Priority 2.2-2.3 (JSON field migration)
4. **Week 4**: Priority 2.4 (WvDestination reconciliation)
5. **Week 5**: Priority 3 (Payment model removal)

## Rollback Plan
Each migration generates a down-migration SQL file. For Priority 1, rollback is:
- Re-add NOT NULL / UNIQUE constraints
- Revert Decimal to Int
- Drop new indexes