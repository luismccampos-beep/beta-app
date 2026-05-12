// src/helpers/bookings.ts
function computeExtrasBreakdown(options, selected, guests) {
  return options.filter((opt) => !!selected[opt.key]).map((opt) => {
    const units = opt.perPerson ? guests : 1;
    return {
      ...opt,
      units,
      lineTotal: opt.price * units
    };
  });
}
function sumExtrasTotal(lines) {
  return lines.reduce((sum, l) => sum + l.lineTotal, 0);
}
function computeTotals(basePerPerson, guests, extrasTotal, taxRate) {
  const baseTotal = basePerPerson * guests;
  const subtotal = baseTotal + extrasTotal;
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;
  return { baseTotal, subtotal, taxAmount, total };
}

export {
  computeExtrasBreakdown,
  sumExtrasTotal,
  computeTotals
};
//# sourceMappingURL=chunk-3IQVQXON.js.map