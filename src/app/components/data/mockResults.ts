import type { DestinationMapMarker } from '../../../lib/travel/destination-map';

export type Language = 'en' | 'pt' | 'es' | 'fr';

export type TravelResult = {
  id: string;
  destination: string;
  country: string;
  continent: string;
  imageUrl: string;
  aiMatchScore: number; // 0-100
  rating: number; // 0-5
  reviews: number;
  duration: number; // days
  price: number;
  /** ISO currency code for `price` (Duffel / combined totals). */
  priceCurrency?: string;
  sustainable: boolean;
  description: Record<Language, string>;
  highlights: string[];
  bestFor: string[];
  /** When set, card shows cruise details instead of flight/hotel only. */
  productType?: 'package' | 'cruise';
  flight: {
    class: string;
  };
  accommodation: {
    type: string;
  };
  cruise?: {
    brandName: string;
    shipName: string;
    sailDate: string;
    departurePort: string;
    arrivalPort: string;
    link: string;
  };
  /** Wikivoyage or provider attribution URL (CC BY-SA). */
  sourceUrl?: string;
  /** Página de detalhe: `pt-42`, `en-1203` */
  destinationSlug?: string;
  /** Secções do artigo Wikivoyage (resumo, veja, faça, coma). */
  destinationCard?: {
    resumo?: string;
    veja?: string[];
    faca?: string[];
    coma?: string[];
    tags?: string[];
    dicas?: Record<string, string[]>;
  };
  /** Custo de vida (1–5 €, índice NYC=100). */
  costOfLiving?: {
    tier: 1 | 2 | 3 | 4 | 5;
    symbols: string;
    index?: number;
    nivel?: string;
    confianca?: 'alta' | 'media' | 'baixa';
    estimado?: boolean;
  };
  /** Aeroporto mais próximo / IATA do destino (OurAirports offline). */
  airport?: {
    iata: string;
    distanciaKm?: number;
    hubFrom?: string;
    indicativePriceEur?: number;
    directFromOrigin?: boolean;
  };
  /** Marcadores OSM (destino, aeroporto, hotéis) para o mini-mapa no card. */
  mapMarkers?: DestinationMapMarker[];
  /** Breakdown de tipos de alojamento por destino (contagem por tipo). */
  hotelTypes?: Record<string, number> | null;
};

export const filterOptions = {
  continents: ['All', 'Europe', 'Asia', 'Africa', 'North America', 'South America', 'Oceania'],
  durations: [
    { label: 'all', min: 0, max: 365 },
    { label: 'Weekend (2-4 days)', min: 2, max: 4 },
    { label: 'Short (5-7 days)', min: 5, max: 7 },
    { label: 'Medium (8-14 days)', min: 8, max: 14 },
    { label: 'Long (15+ days)', min: 15, max: 365 },
  ],
  sortOptions: [
    {
      value: 'ai',
      label: { en: 'Best match', pt: 'Melhor combinação', es: 'Mejor coincidencia', fr: 'Meilleure correspondance' },
    },
    {
      value: 'price-low',
      label: { en: 'Price: low to high', pt: 'Preço: menor para maior', es: 'Precio: menor a mayor', fr: 'Prix: croissant' },
    },
    {
      value: 'price-high',
      label: { en: 'Price: high to low', pt: 'Preço: maior para menor', es: 'Precio: mayor a menor', fr: 'Prix: décroissant' },
    },
    {
      value: 'rating',
      label: { en: 'Highest rating', pt: 'Melhor avaliação', es: 'Mejor calificación', fr: 'Meilleure note' },
    },
    {
      value: 'duration',
      label: { en: 'Shortest duration', pt: 'Menor duração', es: 'Menor duración', fr: 'Durée la plus courte' },
    },
  ],
} as const;
