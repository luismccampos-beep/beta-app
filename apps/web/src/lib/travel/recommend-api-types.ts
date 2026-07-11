/** Tipos partilhados API ↔ frontend (sem dependências de servidor). */

export type TripCostBreakdownDto = {
  currency: string;
  nights: number;
  travelers: number;
  accommodationPerNight: number;
  accommodationTotal: number;
  foodPerDay: number;
  foodTotal: number;
  localTransportPerDay: number;
  localTransportTotal: number;
  flightPerTraveler: number | null;
  flightTotal: number | null;
  flightIsEstimate: boolean;
  dailySubtotal: number;
  tripTotal: number;
  withinBudget: boolean;
  budgetMax: number | null;
  dataQuality: 'live' | 'estimated' | 'mixed';
};

export type RecommendedDestinationDto = {
  destinoId: number;
  slug: string;
  nome: string;
  pais: string;
  iata: string | null;
  tipo: string;
  matchScore: number;
  matchPercent: number;
  wikivoyageInterestScore: number;
  cost: TripCostBreakdownDto;
  hotel: {
    id: number;
    nome: string;
    estrelas: number;
    preco_por_noite: number;
  } | null;
  imageUrl?: string;
};

export type RecommendApiResponse = {
  ok: boolean;
  source?: 'db' | 'bundle';
  disclaimer?: string;
  count?: number;
  destinations?: RecommendedDestinationDto[];
  message?: string;
};
