/** Pull IATA codes from labels like "Lisbon (LIS)" produced by the travel catalog. */
export function extractIataCodesFromDestinationLabels(labels: string[]): string[] {
  const out: string[] = [];
  for (const label of labels) {
    const m = label.match(/\(([A-Z]{3})\)/);
    if (m) out.push(m[1]);
  }
  return [...new Set(out)];
}

export function normalizeDuffelCabinClass(raw: string | undefined | null): string {
  if (!raw) return 'economy';
  const v = raw.trim().toLowerCase().replace(/-/g, '_');
  if (v === 'premium_economy' || v === 'premiumeconomy') return 'premium_economy';
  if (['economy', 'business', 'first'].includes(v)) return v;
  return 'economy';
}

export function defaultDepartureIso(daysAhead = 21): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().slice(0, 10);
}

export function addDaysIso(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
