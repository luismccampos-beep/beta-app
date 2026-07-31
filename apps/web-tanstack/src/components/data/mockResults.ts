/**
 * Shared type definitions for travel results and filter options.
 *
 * This is the canonical source for the TravelResult type used across
 * the web-tanstack app. The type is also inlined in api-client.ts
 * to avoid transitive dependency issues.
 */

import type { AirportSummary } from '@/lib/travel/transport-summary';
import type { CostOfLivingSummary } from '@/lib/travel/cost-tier';
import type { DestinationMapMarker } from '@/lib/travel/destination-map';

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
  hotelTypes?: Record<string, number>;
  matchScore?: number;
  matchPercent?: number;
  /** Airport summary (e.g. IATA, distance, direct flight info). */
  airport?: AirportSummary;
  /** Cost-of-living summary for budget display. */
  costOfLiving?: CostOfLivingSummary;
  /** Map markers for Leaflet / OpenStreetMap display. */
  mapMarkers?: DestinationMapMarker[];
};

export type SortOption = {
  value: string;
  label: Record<string, string>;
};

export type DurationFilter = {
  label: string;
  min: number;
  max: number;
};

export const filterOptions = {
  durations: [
    { label: 'Short (1-3 nights)', min: 1, max: 3 },
    { label: 'Medium (4-7 nights)', min: 4, max: 7 },
    { label: 'Long (8-14 nights)', min: 8, max: 14 },
    { label: 'Extended (15+ nights)', min: 15, max: 30 },
  ] as DurationFilter[],
  continents: [
    'All',
    'Europe',
    'Asia',
    'Africa',
    'North America',
    'South America',
    'Oceania',
  ] as string[],
  sortOptions: [
    {
      value: 'ai',
      label: { en: 'AI Match', pt: 'Match IA', es: 'Coincidencia IA', fr: 'Correspondance IA' },
    },
    {
      value: 'price-low',
      label: { en: 'Price: Low to High', pt: 'Preço: Menor para Maior', es: 'Precio: Menor a Mayor', fr: 'Prix: Croissant' },
    },
    {
      value: 'price-high',
      label: { en: 'Price: High to Low', pt: 'Preço: Maior para Menor', es: 'Precio: Mayor a Menor', fr: 'Prix: Décroissant' },
    },
    {
      value: 'rating',
      label: { en: 'Rating', pt: 'Avaliação', es: 'Valoración', fr: 'Évaluation' },
    },
    {
      value: 'duration',
      label: { en: 'Duration', pt: 'Duração', es: 'Duración', fr: 'Durée' },
    },
  ] as SortOption[],
};