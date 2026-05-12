/**
 * Computes the extras breakdown lines given selected extras and guests.
 */
export function computeExtrasBreakdown(options, selected, guests) {
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
export function sumExtrasTotal(lines) {
    return lines.reduce((sum, l) => sum + l.lineTotal, 0);
}
/**
 * Computes the totals given basePerPerson, guests and extras.
 */
export function computeTotals(basePerPerson, guests, extrasTotal, taxRate // e.g., 0.1 for 10%
) {
    const baseTotal = basePerPerson * guests;
    const subtotal = baseTotal + extrasTotal;
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;
    return { baseTotal, subtotal, taxAmount, total };
}
//# sourceMappingURL=bookings.js.map