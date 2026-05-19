'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import {
  EnhancedTravelPreferencesForm,
  type TravelPreferences,
} from '../../components/pages/EnhancedTravelPreferencesForm';
import { buildResultsSearchParamsFromPreferences } from '../../../lib/travel/buildCruiseQuery';
import {
  storeTravelPreferencesCompact,
  toCompactTravelPreferences,
} from '../../../lib/travel/travel-preferences-query';

export default function Page() {
  const router = useRouter();
  const onComplete = useCallback(
    (prefs: TravelPreferences) => {
      storeTravelPreferencesCompact(toCompactTravelPreferences(prefs));
      router.push(`/results?${buildResultsSearchParamsFromPreferences(prefs)}`);
    },
    [router],
  );
  return <EnhancedTravelPreferencesForm onComplete={onComplete} />;
}
