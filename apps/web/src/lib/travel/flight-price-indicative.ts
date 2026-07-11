/** Helpers cliente para preços indicativos (dados vêm do bundle `transporte.rede`). */
export function formatIndicativeFlightPrice(eur: number, currency = 'EUR'): string {
  if (currency === 'EUR') return `~€${eur}`;
  return `~${eur} ${currency}`;
}
