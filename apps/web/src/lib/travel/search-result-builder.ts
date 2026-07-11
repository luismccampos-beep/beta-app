import type { TravelResult } from '../../app/components/data/mockResults';
import type { CompactTravelPreferences } from './preference-match';
import { continentFromCountryCode } from './continent';
import { buildDestinationSlug } from './destination-slug';
import { resolveDestinationImageUrl } from './destination-image';
import { summarizeCostOfLiving } from './cost-tier';
import { summarizeAirport } from './transport-summary';
import { resolveMapMarkersForDestination } from './travel-map-markers';
import type { MockDestination, MockFlight, MockHotel } from './mock-travel/types';

const CABIN_LABELS: Record<string, string> = {
  economy: 'Economy',
  premium_economy: 'Premium economy',
  business: 'Business',
  first: 'First',
};

function continentPtToEn(c: string): string {
  const m: Record<string, string> = {
    Europa: 'Europe',
    Ásia: 'Asia',
    América: 'North America',
    África: 'Africa',
    Oceânia: 'Oceania',
  };
  return m[c] ?? continentFromCountryCode(null);
}

function scoreFromPrice(total: number): number {
  if (!Number.isFinite(total) || total <= 0) return 72;
  return Math.max(55, Math.min(96, Math.round(100 - total / 120)));
}

export function pickCheapestFlight(flights: MockFlight[], cabinClass?: string): MockFlight | null {
  if (!flights.length) return null;
  const cabin = cabinClass?.trim().toLowerCase().replace(/-/g, '_');
  const filtered = cabin
    ? flights.filter((f) => f.cabin_class === cabin || (cabin === 'economy' && f.cabin_class === 'economy'))
    : flights;
  const list = filtered.length ? filtered : flights;
  return [...list].sort((a, b) => a.preco - b.preco)[0];
}

export type MockSearchInput = {
  origin: string;
  destinationIatas: string[];
  mode: 'both' | 'flights' | 'hotels';
  tripType: 'oneway' | 'roundtrip';
  nights: number;
  departureDate: string;
  returnDate?: string | null;
  cabinClass?: string;
  maxPerDestination?: number;
  preferences?: CompactTravelPreferences | null;
};

export type MockSearchOutput = {
  results: TravelResult[];
  errors: { destination: string; message: string }[];
};

export function buildCatalogTravelResult(input: {
  dest: MockDestination;
  destIata: string;
  origin: string;
  flight: MockFlight | null;
  hotel: MockHotel | null;
  mode: 'both' | 'flights' | 'hotels';
  nights: number;
  tripType: 'oneway' | 'roundtrip';
  departureDate: string;
  returnDate?: string | null;
}): TravelResult | null {
  const { dest, destIata, origin, flight, hotel, mode, nights, tripType, departureDate, returnDate } =
    input;

  if (mode === 'flights' && !flight) return null;
  if (mode === 'hotels' && !hotel) return null;
  if (mode === 'both' && !flight && !hotel) return null;

  let price = 0;
  if (flight) price += flight.preco;
  if (hotel && mode !== 'flights') price += hotel.preco_por_noite * nights;
  if (mode === 'hotels' && hotel) price = hotel.preco_por_noite * nights;
  if (tripType === 'roundtrip' && flight) price = Math.round(price * 1.85 * 100) / 100;

  const continent = dest.paisCode
    ? continentFromCountryCode(dest.paisCode)
    : continentPtToEn(dest.continente);

  const tripLabel = tripType === 'roundtrip' ? 'Ida e volta' : 'Só ida';
  const flightLabel = flight
    ? `${flight.companhia} · ${CABIN_LABELS[flight.cabin_class] ?? flight.cabin_class}`
  : '—';
  const hotelLabel = hotel
    ? `${hotel.nome} (${hotel.estrelas}★ · ${hotel.preco_por_noite} EUR/noite)`
    : 'Hotéis (dados de demonstração)';

  const desc = dest.resumo ?? dest.descricaoCompleta ?? dest.descricao;
  const sourceNote =
    dest.wikivoyageUrl != null
      ? 'Conteúdo de destino via Wikivoyage (CC BY-SA 3.0).'
      : 'Dados de demonstração.';

  const blurb = [
    desc,
    mode !== 'hotels' && flight
      ? `Voo ${origin} → ${destIata} com ${flight.companhia} (${tripLabel.toLowerCase()}).`
      : null,
    mode !== 'flights' && hotel ? `Estadia em ${hotel.nome}, ${nights} noite(s).` : null,
    sourceNote,
  ]
    .filter(Boolean)
    .join(' ');

  const highlights: string[] = [];
  if (flight) {
    highlights.push(flight.companhia);
    highlights.push(flight.escalas === 0 ? 'Direto' : `${flight.escalas} escala(s)`);
    highlights.push(`${Math.round(flight.duracao_minutos / 60)}h ${flight.duracao_minutos % 60}m`);
  }
  if (hotel) highlights.push(`${hotel.estrelas} estrelas`);
  const cardVeja = dest.veja?.[0];
  const cardFaca = dest.faca?.[0];
  if (cardVeja) highlights.push(cardVeja);
  else if (cardFaca) highlights.push(cardFaca);
  else {
    highlights.push(dest.tipo, dest.clima);
  }
  if (dest.wikivoyageUrl) highlights.push('Wikivoyage');

  const imageUrl =
    resolveDestinationImageUrl(dest) ||
    'https://images.unsplash.com/photo-1469854523086-cc02afe5c88?auto=format&fit=crop&w=1400&q=70';

  return {
    id: `mock-${tripType}-${origin}-${destIata}-${departureDate}-${hotel?.id ?? 0}-${flight?.id ?? 0}`,
    destination: dest.nome,
    country: dest.pais,
    continent,
    imageUrl,
    aiMatchScore: scoreFromPrice(price),
    rating: hotel ? Math.min(5, 3.2 + hotel.estrelas * 0.35) : 4.1,
    reviews: 40 + (hotel?.id ?? 0) % 200 + (flight?.id ?? 0) % 150,
    duration: nights,
    price: Math.round(price),
    priceCurrency: 'EUR',
    sustainable: flight ? flight.escalas === 0 && flight.duracao_minutos < 240 : true,
    productType: 'package',
    description: { en: blurb, pt: blurb, es: blurb, fr: blurb },
    highlights: highlights.slice(0, 4),
    bestFor:
      dest.tags?.length ? [...dest.tags.slice(0, 2), tripLabel] : [dest.tipo, tripLabel, mode === 'flights' ? 'Só voos' : 'Pacote demo'],
    flight: { class: flightLabel },
    accommodation: { type: mode === 'flights' ? 'Sem hotel (demo)' : hotelLabel },
    sourceUrl: dest.wikivoyageUrl,
    destinationSlug: buildDestinationSlug(dest),
    destinationCard:
      dest.resumo ||
      dest.veja?.length ||
      dest.faca?.length ||
      dest.coma?.length ||
      (dest.dicas && Object.keys(dest.dicas).length > 0)
        ? {
            resumo: dest.resumo,
            veja: dest.veja,
            faca: dest.faca,
            coma: dest.coma,
            tags: dest.tags,
            dicas: dest.dicas,
          }
        : undefined,
    costOfLiving: summarizeCostOfLiving(dest.custo_de_vida) ?? undefined,
    airport: summarizeAirport(dest, destIata, origin) ?? undefined,
    mapMarkers: (() => {
      const markers = resolveMapMarkersForDestination(dest);
      return markers.length > 0 ? markers : undefined;
    })(),
  };
}
