import type { MockDestination, MockHotel, MockFlight } from './travel';

export type TravelResult = {
  destino: MockDestination;
  hoteis: MockHotel[];
  voos: MockFlight[];
  matchScore?: number;
  matchPercent?: number;
};

export type Language = {
  language: string;
  proficiency: string;
};

export type TravelCatalogResponse = {
  destinos: MockDestination[];
  hoteis: MockHotel[];
  voos: MockFlight[];
};

export type TravelDestinationsResponse = {
  destinations: MockDestination[];
  total: number;
  offset: number;
  limit: number;
};

export type TravelResultsResponse = {
  results: TravelResult[];
  total: number;
};

export type MeResponse = {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
};

export type UserPreferencesResponse = {
  preferences: Record<string, unknown>;
};

export type RecommendedDestinationDto = {
  destinationId: number;
  name: string;
  country: string;
  score: number;
  matchReasons: string[];
};

export type TripCostBreakdownDto = {
  flights: number;
  accommodation: number;
  dailyExpenses: number;
  total: number;
  currency: string;
};

export type RecommendApiResponse = {
  destinations: RecommendedDestinationDto[];
  tripCost?: TripCostBreakdownDto;
};
