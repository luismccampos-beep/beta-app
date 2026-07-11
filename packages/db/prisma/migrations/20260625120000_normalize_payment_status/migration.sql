-- Normalize PaymentStatus enum: remove SUCCEEDED, COMPLETED, CANCELED
-- Map existing values to canonical ones before altering the enum type

-- Step 1: Update existing rows to use canonical values
UPDATE bookings SET payment_status = 'PAID' WHERE payment_status IN ('SUCCEEDED', 'COMPLETED');
UPDATE bookings SET payment_status = 'CANCELLED' WHERE payment_status = 'CANCELED';
UPDATE payment_transactions SET status = 'PAID' WHERE status IN ('SUCCEEDED', 'COMPLETED');
UPDATE payment_transactions SET status = 'CANCELLED' WHERE status = 'CANCELED';
UPDATE invoices SET status = 'PAID' WHERE status IN ('SUCCEEDED', 'COMPLETED');
UPDATE invoices SET status = 'CANCELLED' WHERE status = 'CANCELED';
UPDATE refund_requests SET status = 'PAID' WHERE status IN ('SUCCEEDED', 'COMPLETED');
UPDATE refund_requests SET status = 'CANCELLED' WHERE status = 'CANCELED';
UPDATE admin_transactions SET status = 'PAID' WHERE status IN ('SUCCEEDED', 'COMPLETED');
UPDATE admin_transactions SET status = 'CANCELLED' WHERE status = 'CANCELED';

-- Step 2: Create new enum type without the redundant values
CREATE TYPE "PaymentStatus_new" AS ENUM (
  'PENDING', 'PAID', 'PROCESSING', 'FAILED', 'REFUNDED',
  'CANCELLED', 'PARTIALLY_REFUNDED', 'REQUIRES_ACTION'
);

-- Step 3: Drop defaults before altering type (default references old enum)
ALTER TABLE bookings ALTER COLUMN payment_status DROP DEFAULT;

-- Step 4: Alter columns to use new type
ALTER TABLE bookings ALTER COLUMN payment_status TYPE "PaymentStatus_new"
  USING (payment_status::text::"PaymentStatus_new");

ALTER TABLE payment_transactions ALTER COLUMN status TYPE "PaymentStatus_new"
  USING (status::text::"PaymentStatus_new");

ALTER TABLE invoices ALTER COLUMN status TYPE "PaymentStatus_new"
  USING (status::text::"PaymentStatus_new");

ALTER TABLE refund_requests ALTER COLUMN status TYPE "PaymentStatus_new"
  USING (status::text::"PaymentStatus_new");

ALTER TABLE admin_transactions ALTER COLUMN status TYPE "PaymentStatus_new"
  USING (status::text::"PaymentStatus_new");

-- Step 5: Drop old enum and rename new one
DROP TYPE "PaymentStatus" CASCADE;
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";

-- Step 6: Restore default value for bookings.payment_status
ALTER TABLE bookings ALTER COLUMN payment_status SET DEFAULT 'PENDING'::"PaymentStatus";
