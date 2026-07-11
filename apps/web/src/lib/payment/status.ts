export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  PROCESSING: 'PROCESSING',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
  CANCELLED: 'CANCELLED',
  PARTIALLY_REFUNDED: 'PARTIALLY_REFUNDED',
  REQUIRES_ACTION: 'REQUIRES_ACTION',
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

const STATUS_MAP: Record<string, PaymentStatus> = {
  PAID: 'PAID',
  SUCCEEDED: 'PAID',
  COMPLETED: 'PAID',
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
  CANCELLED: 'CANCELLED',
  CANCELED: 'CANCELLED',
  PARTIALLY_REFUNDED: 'PARTIALLY_REFUNDED',
  REQUIRES_ACTION: 'REQUIRES_ACTION',
};

export function normalizePaymentStatus(status: string): PaymentStatus {
  const upper = status.toUpperCase();
  return STATUS_MAP[upper] ?? 'PENDING';
}

export function isPaymentSuccessful(status: string): boolean {
  return normalizePaymentStatus(status) === 'PAID';
}

export function isPaymentFailed(status: string): boolean {
  const s = normalizePaymentStatus(status);
  return s === 'FAILED' || s === 'CANCELLED';
}
