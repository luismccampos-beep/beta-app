import { loadMockTravelBundle } from './load';

const AMENITY_LABELS: Record<string, string> = {
  wifi: 'Wi‑Fi',
  piscina: 'Piscina',
  spa: 'Spa',
  estacionamento: 'Estacionamento',
  'ar-condicionado': 'Ar condicionado',
  'pequeno-almoço': 'Pequeno-almoço',
  ginásio: 'Ginásio',
};

export function getMockCatalogData() {
  const { hoteis, destinos } = loadMockTravelBundle();

  const amenitySet = new Set<string>();
  for (const h of hoteis) for (const a of h.comodidades) amenitySet.add(a);

  const accommodations = [
    { code: 'hotel', label: 'Hotel' },
    { code: 'resort', label: 'Resort' },
    { code: 'pousada', label: 'Pousada' },
    { code: 'albergaria', label: 'Albergaria' },
    { code: 'suites', label: 'Suites' },
  ];

  const chainNames = new Set<string>();
  for (const h of hoteis) {
    const first = h.nome.split(' ')[0];
    if (first && first.length > 2) chainNames.add(first);
  }
  const chains = [...chainNames]
    .slice(0, 40)
    .sort((a, b) => a.localeCompare(b))
    .map((name, i) => ({ code: `mock-chain-${i}`, label: name }));

  const facilities = [...amenitySet].map((code) => ({
    code,
    label: AMENITY_LABELS[code] ?? code,
  }));

  const airports = destinos
    .filter((d) => d.iata)
    .map((d) => ({
      iataCode: d.iata!,
      label: `${d.nome} (${d.iata})`,
      country: d.paisCode,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return {
    accommodations,
    chains,
    facilities,
    airports,
    mock: true as const,
  };
}
