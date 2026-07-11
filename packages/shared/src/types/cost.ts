export type CostTier = 1 | 2 | 3 | 4 | 5;

export type CostOfLivingSummary = {
  tier: CostTier;
  symbols: string;
  index?: number;
  nivel?: string;
  confianca?: 'alta' | 'media' | 'baixa';
  estimado?: boolean;
};

export type TripCostInput = {
  destination: string;
  days: number;
  dailyBudgetProfile: 'mochileiro' | 'conforto' | 'luxo';
  flightOrigin?: string;
  cabinClass?: string;
  accommodationType?: string[];
};

export type TripCostBreakdown = {
  flights: number;
  accommodation: number;
  dailyExpenses: number;
  total: number;
  currency: string;
};

export type DailyBudgetEstimate = {
  profile: TravelBudgetProfileId;
  total_dia: number;
  moeda: string;
  breakdown: Partial<Record<BudgetLineId, number>>;
};

export type BudgetLineId =
  | 'breakfastSupermarket'
  | 'breakfastCafe'
  | 'lunchBudget'
  | 'lunchMid'
  | 'lunchHigh'
  | 'dinnerBudget'
  | 'dinnerMid'
  | 'dinnerHigh'
  | 'transportDaily'
  | 'attractions'
  | 'coffeeSnack'
  | 'waterBottle';

export type CityPriceRow = {
  x1?: number | null;
  x2?: number | null;
  x3?: number | null;
  x14?: number | null;
  x26?: number | null;
  x39?: number | null;
};

type TravelBudgetProfileId = 'mochileiro' | 'conforto' | 'luxo';

export type BudgetChip = {
  id: string;
  label: string;
  range: [number, number];
  emoji: string;
};
