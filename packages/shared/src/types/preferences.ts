export type TravelBudgetProfileId = 'mochileiro' | 'conforto' | 'luxo';

export const TRAVEL_BUDGET_PROFILE_IDS: TravelBudgetProfileId[] = [
  'mochileiro',
  'conforto',
  'luxo',
];

export const PROFILE_TO_BUDGET_PRIORITY: Record<TravelBudgetProfileId, string> = {
  mochileiro: 'maximum-savings',
  conforto: 'balanced',
  luxo: 'luxury',
};

/** Subset of travel preferences used for rule-based matching (URL-safe). */
export type CompactTravelPreferences = {
  travelStyles?: string[];
  preferredDestinations?: string[];
  activityTypes?: string[];
  travelPurpose?: string[];
  pacePreference?: string;
  budgetRange?: [number, number];
  budgetPriority?: string;
  dailyBudgetProfile?: TravelBudgetProfileId;
  sustainabilityLevel?: string;
  ecoPreferences?: string[];
  accommodationType?: string[];
  experienceTypes?: string[];
  cabinClass?: string;
};
