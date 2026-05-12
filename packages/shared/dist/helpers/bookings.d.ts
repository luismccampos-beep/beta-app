import type { ExtrasLine, ExtraOption } from '../types/bookings.js';
/**
 * Computes the extras breakdown lines given selected extras and guests.
 */
export declare function computeExtrasBreakdown(options: ExtraOption[], selected: Record<string, boolean>, guests: number): ExtrasLine[];
/**
 * Sums line totals from extras breakdown.
 */
export declare function sumExtrasTotal(lines: ExtrasLine[]): number;
/**
 * Computes the totals given basePerPerson, guests and extras.
 */
export declare function computeTotals(basePerPerson: number, guests: number, extrasTotal: number, taxRate: number): {
    baseTotal: number;
    subtotal: number;
    taxAmount: number;
    total: number;
};
