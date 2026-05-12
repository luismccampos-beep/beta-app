'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import {
  EnhancedTravelPreferencesForm,
  type TravelPreferences,
} from '../../components/pages/EnhancedTravelPreferencesForm';
import {
  defaultDepartureIso,
  extractIataCodesFromDestinationLabels,
  normalizeDuffelCabinClass,
} from '../../../lib/travel/buildResultsQuery';

function buildResultsSearchParams(p: TravelPreferences): string {
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
  return qs.toString();
}

export default function Page() {
  const router = useRouter();
  const onComplete = useCallback(
    (prefs: TravelPreferences) => {
      router.push(`/results?${buildResultsSearchParams(prefs)}`);
    },
    [router],
  );
  return <EnhancedTravelPreferencesForm onComplete={onComplete} />;
}
