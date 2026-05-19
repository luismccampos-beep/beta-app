import type { TravelPreferences } from '../../app/components/pages/EnhancedTravelPreferencesForm';
import {
  CRUISE_DURATION_IDS,
  CRUISE_SHIP_TYPE_IDS,
  CRUISE_TIER_IDS,
  type CruiseDurationId,
} from '../i18n/preferences-form-options';
import {
  defaultDepartureIso,
  extractIataCodesFromDestinationLabels,
  normalizeDuffelCabinClass,
} from './buildResultsQuery';
import {
  encodeTravelPreferencesCompact,
  toCompactTravelPreferences,
} from './travel-preferences-query';
import { SILOAH_DESTINATION_IDS } from './siloah';

const DURATION_NIGHTS: Record<CruiseDurationId, { min?: number; max?: number }> = {
  short: { min: 3, max: 5 },
  medium: { min: 6, max: 9 },
  long: { min: 10, max: 30 },
};

export function cruiseDurationToNights(duration: string): { minNights?: number; maxNights?: number } {
  if (!(CRUISE_DURATION_IDS as readonly string[]).includes(duration)) return {};
  const range = DURATION_NIGHTS[duration as CruiseDurationId];
  if (!range) return {};
  return {
    minNights: range.min,
    maxNights: range.max,
  };
}

export function buildCruiseSearchParams(p: TravelPreferences): URLSearchParams {
  const qs = new URLSearchParams();

  const dest =
    p.cruiseDestinations.find((d) =>
      (SILOAH_DESTINATION_IDS as readonly string[]).includes(d),
    ) ?? p.cruiseDestinations[0];
  if (dest) qs.set('destination', dest);

  const brand = p.cruiseBrandNames[0];
  if (brand) qs.set('brandName', brand);

  if ((CRUISE_TIER_IDS as readonly string[]).includes(p.cruiseTier)) {
    qs.set('tier', p.cruiseTier);
  }

  if ((CRUISE_SHIP_TYPE_IDS as readonly string[]).includes(p.cruiseShipType)) {
    qs.set('shipType', p.cruiseShipType);
  }

  const { minNights, maxNights } = cruiseDurationToNights(p.cruiseDuration);
  if (minNights != null) qs.set('minNights', String(minNights));
  if (maxNights != null) qs.set('maxNights', String(maxNights));

  const maxPrice = p.budgetRange?.[1];
  if (typeof maxPrice === 'number' && maxPrice > 0) {
    qs.set('maxPrice', String(Math.round(maxPrice)));
  }

  const monthFrom = defaultCruiseMonthFrom(60);
  qs.set('monthFrom', monthFrom);
  qs.set('mode', 'cruises');

  return qs;
}

/** YYYY-MM — first day of month ~daysAhead from now. */
export function defaultCruiseMonthFrom(daysAhead = 60): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + daysAhead);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export function buildResultsSearchParamsFromPreferences(p: TravelPreferences): string {
  if (p.cruiseEnabled) {
    const cruiseQs = buildCruiseSearchParams(p);
    cruiseQs.set('mode', 'cruises');
    return cruiseQs.toString();
  }

  const qs = new URLSearchParams();
  const origin = process.env.NEXT_PUBLIC_DEFAULT_ORIGIN_IATA?.trim() || 'LIS';
  qs.set('origin', origin.toUpperCase());

  const codes = extractIataCodesFromDestinationLabels(p.preferredDestinations);
  if (codes.length) qs.set('destinations', codes.slice(0, 6).join(','));

  qs.set('departure', defaultDepartureIso(21));
  qs.set('nights', '5');
  qs.set('adults', '1');
  qs.set('cabinClass', normalizeDuffelCabinClass(p.cabinClass));
  qs.set('tripType', 'roundtrip');
  qs.set('mode', 'both');

  const compact = toCompactTravelPreferences(p);
  const encoded = encodeTravelPreferencesCompact(compact);
  if (encoded.length <= 1800) qs.set('prefs', encoded);

  return qs.toString();
}
