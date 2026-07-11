// Types
export type {
  MockDestination,
  MockHotel,
  MockFlight,
  MockTravelBundle,
} from './types/travel';

export type {
  TravelBudgetProfileId,
  CompactTravelPreferences,
} from './types/preferences';

export {
  TRAVEL_BUDGET_PROFILE_IDS,
  PROFILE_TO_BUDGET_PRIORITY,
} from './types/preferences';

export type {
  CostTier,
  CostOfLivingSummary,
  TripCostInput,
  TripCostBreakdown,
  DailyBudgetEstimate,
  BudgetLineId,
  CityPriceRow,
  BudgetChip,
} from './types/cost';

export type {
  TravelResult,
  Language,
  TravelCatalogResponse,
  TravelDestinationsResponse,
  TravelResultsResponse,
  MeResponse,
  UserPreferencesResponse,
  RecommendedDestinationDto,
  TripCostBreakdownDto,
  RecommendApiResponse,
} from './types/api';

export type {
  LatLon,
  RoadDistanceResult,
  DestinationMapMarker,
  HotelMapPoint,
  DestinationMapInput,
} from './types/geo';

// Schemas
export {
  quickStartSchema,
  travelPreferencesSchema,
  DEFAULT_TRAVEL_PREFERENCES,
  STEP_FIELDS,
  OPTIONAL_FIELD_HINT,
} from './schemas/preferences';

export type { TravelPreferences, QuickStartPreferences } from './schemas/preferences';

export {
  SearchDestinationsSchema,
  GetDestinationBySlugSchema,
  NearbyHotelsSchema,
} from './schemas/destination';

export type { SearchDestinationsInput } from './schemas/destination';

// Utils
export { haversineKm, boundingBox, proximityScoreFromKm } from './utils/geo';
export { buildDestinationSlug, parseDestinationSlug } from './utils/slug';
export {
  costTierFromIndex,
  costTierSymbols,
  costTierLabelKey,
  summarizeCostOfLiving,
} from './utils/cost-tier';
export { continentFromCountryCode } from './utils/continent';
export {
  isLikelyAccommodationName,
  isAccommodationHotel,
  pickBestAccommodationHotel,
} from './utils/hotel-filter';
