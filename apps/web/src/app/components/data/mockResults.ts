import type { AirportSummary } from '../../../lib/travel/transport-summary';
import type { CostOfLivingSummary } from '../../../lib/travel/cost-tier';
import type { DestinationMapMarker } from '../../../lib/travel/destination-map';

export type TravelResult = {
  id: string;
  destination: string;
  country: string;
  continent: string;
  imageUrl: string;
  aiMatchScore: number;
  rating: number;
  reviews: number;
  duration: number;
  price: number;
  priceCurrency?: string;
  sustainable: boolean;
  productType?: string;
  description: { en: string; pt: string; es?: string; fr?: string };
  highlights?: string[];
  bestFor: string[];
  flight?: { class: string };
  accommodation?: { type: string };
  sourceUrl?: string;
  destinationSlug?: string;
  destinationCard?: {
    resumo?: string;
    veja?: string[];
    faca?: string[];
    coma?: string[];
    tags?: string[];
    dicas?: Record<string, string[]>;
  };
  costOfLiving?: CostOfLivingSummary;
  airport?: AirportSummary;
  hotelTypes?: Record<string, number>;
  mapMarkers?: DestinationMapMarker[];
  matchScore?: number;
  matchPercent?: number;
};

export const filterOptions = {
  continents: ['All', 'Europe', 'Asia', 'North America', 'Africa', 'Oceania', 'South America'] as string[],
  durations: [
    { label: 'Short (1-4 nights)', min: 1, max: 4 },
    { label: 'Medium (5-9 nights)', min: 5, max: 9 },
    { label: 'Long (10+ nights)', min: 10, max: 99 },
  ],
  sortOptions: [
    { value: 'ai-match', label: { en: 'AI Match', pt: 'Match IA', es: 'Match IA', fr: 'Match IA' } },
    { value: 'price-low', label: { en: 'Price: Low to High', pt: 'Preço: Menor para Maior', es: 'Precio: Menor a Mayor', fr: 'Prix: Croissant' } },
    { value: 'price-high', label: { en: 'Price: High to Low', pt: 'Preço: Maior para Menor', es: 'Precio: Mayor a Menor', fr: 'Prix: Décroissant' } },
    { value: 'rating', label: { en: 'Rating', pt: 'Avaliação', es: 'Valoración', fr: 'Note' } },
    { value: 'duration', label: { en: 'Duration', pt: 'Duração', es: 'Duración', fr: 'Durée' } },
  ],
};
