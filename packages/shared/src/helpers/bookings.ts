// packages/shared/src/helpers/bookings.ts
import type { ExtrasLine, ExtraOption } from '../types/bookings.js';

/**
 * Computes the extras breakdown lines given selected extras and guests.
 */
export function computeExtrasBreakdown(
  options: ExtraOption[],
  selected: Record<string, boolean>,
  guests: number
): ExtrasLine[] {
  return options
    .filter((opt) => !!selected[opt.key])
    .map((opt) => {
      const units = opt.perPerson ? guests : 1;
      return {
        ...opt,
        units,
        lineTotal: opt.price * units,
      };
    });
}

/**
 * Sums line totals from extras breakdown.
 */
export function sumExtrasTotal(lines: ExtrasLine[]): number {
  return lines.reduce((sum, l) => sum + l.lineTotal, 0);
}

/**
 * Computes the totals given basePerPerson, guests and extras.
 */
export function computeTotals(
  basePerPerson: number,
  guests: number,
  extrasTotal: number,
  taxRate: number // e.g., 0.1 for 10%
): {
  baseTotal: number;
  subtotal: number;
  taxAmount: number;
  total: number;
} {
  const baseTotal = basePerPerson * guests;
  const subtotal = baseTotal + extrasTotal;
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;
  return { baseTotal, subtotal, taxAmount, total };
}

