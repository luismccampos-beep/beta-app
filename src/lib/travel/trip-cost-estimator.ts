import { dailyTotalFromBundle, type TravelBudgetProfileId } from './daily-budget-profiles';
import type { CompactTravelPreferences } from './preference-match';
import type { MockDestination, MockHotel } from './mock-travel/types';

export type TripCostInput = {
  nights: number;
  travelers: number;
  preferences: CompactTravelPreferences;
  currency?: string;
};

export type TripCostBreakdown = {
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
  /** Preço de voo é indicativo (bundle/OpenFlights), não tempo real. */
  flightIsEstimate: boolean;
  dailySubtotal: number;
  tripTotal: number;
  withinBudget: boolean;
  budgetMax: number | null;
  dataQuality: 'live' | 'estimated' | 'mixed';
};

function minStarsFromPrefs(prefs: CompactTravelPreferences): number {
  const acc = prefs.accommodationType ?? [];
  if (acc.some((a) => /luxury|resort|5/i.test(a))) return 4;
  if (prefs.dailyBudgetProfile === 'luxo' || prefs.budgetPriority === 'luxury') return 4;
  if (prefs.dailyBudgetProfile === 'mochileiro') return 1;
  return 2;
}

function defaultNightlyByStars(stars: number): number {
  if (stars >= 5) return 180;
  if (stars >= 4) return 120;
  if (stars >= 3) return 85;
  return 55;
}

/**
 * Estima custo total da viagem (alojamento + alimentação + transporte local + voo indicativo).
 * Não é previsão ML — agregação de preços médios / custo de vida do catálogo.
 */
export function estimateTripCost(
  dest: MockDestination,
  input: TripCostInput,
  opts?: {
    hotel?: MockHotel | null;
    flightPrice?: number | null;
    flightIsEstimate?: boolean;
    avgHotelNightly?: number | null;
  },
): TripCostBreakdown {
  const nights = Math.max(1, input.nights);
  const travelers = Math.max(1, input.travelers);
  const prefs = input.preferences;
  const profile: TravelBudgetProfileId = prefs.dailyBudgetProfile ?? 'conforto';
  const currency = input.currency ?? 'EUR';

  const minStars = minStarsFromPrefs(prefs);
  let accommodationPerNight = opts?.hotel?.preco_por_noite ?? opts?.avgHotelNightly ?? null;
  if (accommodationPerNight == null) {
    accommodationPerNight = defaultNightlyByStars(minStars);
  }
  if (opts?.hotel && opts.hotel.estrelas < minStars) {
    accommodationPerNight = Math.round(accommodationPerNight * 1.15);
  }

  const bundleFood = dailyTotalFromBundle(profile, dest.custo_de_vida);
  const foodPerDay = bundleFood?.total ?? (profile === 'luxo' ? 95 : profile === 'mochileiro' ? 35 : 58);
  const localTransportPerDay = Math.round(foodPerDay * 0.12 * 100) / 100;

  const accommodationTotal = accommodationPerNight * nights * travelers;
  const foodTotal = foodPerDay * nights * travelers;
  const localTransportTotal = localTransportPerDay * nights * travelers;

  const flightPerTraveler = opts?.flightPrice ?? null;
  const flightIsEstimate = opts?.flightIsEstimate ?? flightPerTraveler != null;
  const flightTotal =
    flightPerTraveler != null ? Math.round(flightPerTraveler * travelers * 100) / 100 : null;

  const dailySubtotal =
    (accommodationPerNight + foodPerDay + localTransportPerDay) * travelers;
  const tripTotal =
    accommodationTotal +
    foodTotal +
    localTransportTotal +
    (flightTotal ?? 0);

  const budgetMax = prefs.budgetRange?.[1] ?? null;
  const withinBudget = budgetMax == null ? true : tripTotal <= budgetMax;

  const dataQuality: TripCostBreakdown['dataQuality'] =
    opts?.hotel && flightPerTraveler != null
      ? 'mixed'
      : opts?.hotel || bundleFood
        ? 'estimated'
        : 'estimated';

  return {
    currency,
    nights,
    travelers,
    accommodationPerNight,
    accommodationTotal,
    foodPerDay,
    foodTotal,
    localTransportPerDay,
    localTransportTotal,
    flightPerTraveler,
    flightTotal,
    flightIsEstimate,
    dailySubtotal: Math.round(dailySubtotal * 100) / 100,
    tripTotal: Math.round(tripTotal * 100) / 100,
    withinBudget,
    budgetMax,
    dataQuality,
  };
}
