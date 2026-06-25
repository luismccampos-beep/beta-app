-- Normalize all @map annotations to snake_case
-- Timestamp renames: createdat -> created_at, updatedat -> updated_at, deletedat -> deleted_at
-- Package model field renames
-- VoucherUsage usedat -> used_at
-- Remove duplicate/unused models

-- accommodations
ALTER TABLE IF EXISTS "accommodations" RENAME COLUMN "createdat" TO "created_at";
ALTER TABLE IF EXISTS "accommodations" RENAME COLUMN "updatedat" TO "updated_at";

-- activities
ALTER TABLE IF EXISTS "activities" RENAME COLUMN "createdat" TO "created_at";

-- airlines
ALTER TABLE IF EXISTS "airlines" RENAME COLUMN "createdat" TO "created_at";

-- airports
ALTER TABLE IF EXISTS "airports" RENAME COLUMN "createdat" TO "created_at";

-- bookings
ALTER TABLE IF EXISTS "bookings" RENAME COLUMN "createdat" TO "created_at";
ALTER TABLE IF EXISTS "bookings" RENAME COLUMN "updatedat" TO "updated_at";

-- booking_history
ALTER TABLE IF EXISTS "booking_history" RENAME COLUMN "createdat" TO "created_at";

-- cart_items
ALTER TABLE IF EXISTS "cart_items" RENAME COLUMN "createdat" TO "created_at";

-- cruises
ALTER TABLE IF EXISTS "cruises" RENAME COLUMN "createdat" TO "created_at";
ALTER TABLE IF EXISTS "cruises" RENAME COLUMN "updatedat" TO "updated_at";

-- cruise_bookings
ALTER TABLE IF EXISTS "cruise_bookings" RENAME COLUMN "createdat" TO "created_at";

-- flights
ALTER TABLE IF EXISTS "flights" RENAME COLUMN "createdat" TO "created_at";
ALTER TABLE IF EXISTS "flights" RENAME COLUMN "updatedat" TO "updated_at";

-- flight_bookings
ALTER TABLE IF EXISTS "flight_bookings" RENAME COLUMN "createdat" TO "created_at";

-- flight_details
ALTER TABLE IF EXISTS "flight_details" RENAME COLUMN "createdat" TO "created_at";
ALTER TABLE IF EXISTS "flight_details" RENAME COLUMN "updatedat" TO "updated_at";

-- hotels
ALTER TABLE IF EXISTS "hotels" RENAME COLUMN "createdat" TO "created_at";
ALTER TABLE IF EXISTS "hotels" RENAME COLUMN "updatedat" TO "updated_at";

-- hotel_bookings
ALTER TABLE IF EXISTS "hotel_bookings" RENAME COLUMN "createdat" TO "created_at";

-- hotel_details
ALTER TABLE IF EXISTS "hotel_details" RENAME COLUMN "createdat" TO "created_at";
ALTER TABLE IF EXISTS "hotel_details" RENAME COLUMN "updatedat" TO "updated_at";

-- hotel_rooms
ALTER TABLE IF EXISTS "hotel_rooms" RENAME COLUMN "createdat" TO "created_at";
ALTER TABLE IF EXISTS "hotel_rooms" RENAME COLUMN "updatedat" TO "updated_at";

-- packages (includes timestamp + field renames)
ALTER TABLE IF EXISTS "packages" RENAME COLUMN "createdat" TO "created_at";
ALTER TABLE IF EXISTS "packages" RENAME COLUMN "updatedat" TO "updated_at";
ALTER TABLE IF EXISTS "packages" RENAME COLUMN "deletedat" TO "deleted_at";
ALTER TABLE IF EXISTS "packages" RENAME COLUMN "durationdays" TO "duration_days";
ALTER TABLE IF EXISTS "packages" RENAME COLUMN "priceoriginal" TO "price_original";
ALTER TABLE IF EXISTS "packages" RENAME COLUMN "pricecurrent" TO "price_current";
ALTER TABLE IF EXISTS "packages" RENAME COLUMN "imageurl" TO "image_url";
ALTER TABLE IF EXISTS "packages" RENAME COLUMN "reviewscount" TO "reviews_count";
ALTER TABLE IF EXISTS "packages" RENAME COLUMN "metatitle" TO "meta_title";
ALTER TABLE IF EXISTS "packages" RENAME COLUMN "metadescription" TO "meta_description";

-- payments
ALTER TABLE IF EXISTS "payments" RENAME COLUMN "createdat" TO "created_at";
ALTER TABLE IF EXISTS "payments" RENAME COLUMN "updatedat" TO "updated_at";

-- payment_transactions
ALTER TABLE IF EXISTS "payment_transactions" RENAME COLUMN "createdat" TO "created_at";
ALTER TABLE IF EXISTS "payment_transactions" RENAME COLUMN "updatedat" TO "updated_at";

-- promotions
ALTER TABLE IF EXISTS "promotions" RENAME COLUMN "createdat" TO "created_at";
ALTER TABLE IF EXISTS "promotions" RENAME COLUMN "updatedat" TO "updated_at";

-- providers
ALTER TABLE IF EXISTS "providers" RENAME COLUMN "createdat" TO "created_at";
ALTER TABLE IF EXISTS "providers" RENAME COLUMN "updatedat" TO "updated_at";

-- services
ALTER TABLE IF EXISTS "services" RENAME COLUMN "createdat" TO "created_at";
ALTER TABLE IF EXISTS "services" RENAME COLUMN "updatedat" TO "updated_at";

-- service_bookings
ALTER TABLE IF EXISTS "service_bookings" RENAME COLUMN "createdat" TO "created_at";

-- service_details
ALTER TABLE IF EXISTS "service_details" RENAME COLUMN "createdat" TO "created_at";
ALTER TABLE IF EXISTS "service_details" RENAME COLUMN "updatedat" TO "updated_at";

-- service_images
ALTER TABLE IF EXISTS "service_images" RENAME COLUMN "createdat" TO "created_at";

-- system_payment_methods
ALTER TABLE IF EXISTS "system_payment_methods" RENAME COLUMN "createdat" TO "created_at";
ALTER TABLE IF EXISTS "system_payment_methods" RENAME COLUMN "updatedat" TO "updated_at";

-- transfers
ALTER TABLE IF EXISTS "transfers" RENAME COLUMN "createdat" TO "created_at";

-- transfer_bookings
ALTER TABLE IF EXISTS "transfer_bookings" RENAME COLUMN "createdat" TO "created_at";

-- vouchers
ALTER TABLE IF EXISTS "vouchers" RENAME COLUMN "createdat" TO "created_at";

-- voucher_usage
ALTER TABLE IF EXISTS "voucher_usage" RENAME COLUMN "usedat" TO "used_at";

-- ============================================
-- Remove duplicate/unused models
-- ============================================
DROP TABLE IF EXISTS "payments" CASCADE;
DROP TABLE IF EXISTS "hotel_properties" CASCADE;
DROP TABLE IF EXISTS "activity_offerings" CASCADE;
DROP TABLE IF EXISTS "activities" CASCADE;
DROP TABLE IF EXISTS "crm_customers" CASCADE;
DROP TABLE IF EXISTS "crm_bookings" CASCADE;
