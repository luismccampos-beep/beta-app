'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { CompactTravelPreferences } from '../../../lib/travel/preference-match';
import type { RecommendApiResponse } from '../../../lib/travel/recommend-api-types';
import { encodeTravelPreferencesCompact } from '../../../lib/travel/travel-preferences-query';
import { RecommendedDestinationCard } from './RecommendedDestinationCard';

export type RecommendationsSectionProps = {
  preferences: CompactTravelPreferences | null;
  nights: number;
  travelers: number;
  originIata: string;
  resultsQuery: string;
  locale: string;
  onFocusLiveSearch: (iata: string) => void;
  enabled?: boolean;
};

export function RecommendationsSection({
  preferences,
  nights,
  travelers,
  originIata,
  resultsQuery,
  locale,
  onFocusLiveSearch,
  enabled = true,
}: RecommendationsSectionProps) {
  const t = useTranslations('results.recommend');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RecommendApiResponse | null>(null);

  const prefsKey = useMemo(
    () => (preferences ? encodeTravelPreferencesCompact(preferences) : ''),
    [preferences],
  );

  const detailQuery = useMemo(() => {
    const p = new URLSearchParams(resultsQuery);
    if (preferences && prefsKey.length <= 1800) {
      p.set('prefs', prefsKey);
    }
    return p.toString();
  }, [resultsQuery, preferences, prefsKey]);

  const cardLabels = useMemo(
    () => ({
      match: t('match'),
      estimatedTrip: t('estimatedTrip'),
      accommodation: t('accommodation'),
      food: t('food'),
      transport: t('transport'),
      flight: t('flight'),
      total: t('total'),
      withinBudget: t('withinBudget'),
      overBudget: t('overBudget'),
      estimateNote: t('estimateNote'),
      viewDestination: t('viewDestination'),
      searchLive: t('searchLive'),
      perNight: t('perNight'),
      travelers: t('travelers'),
      nights: t('nights'),
    }),
    [t],
  );

  useEffect(() => {
    if (!enabled || !preferences) {
      setLoading(false);
      setData(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      nights: String(nights),
      travelers: String(travelers),
      origin: originIata,
      budgetFilter: '1',
      limit: '12',
      lang: locale.startsWith('pt') ? 'pt' : locale.startsWith('es') ? 'es' : locale.startsWith('fr') ? 'fr' : 'pt',
    });
    if (prefsKey) params.set('prefs', prefsKey);

    fetch(`/api/travel/v1/recommend?${params}`)
      .then(async (res) => {
        const json = (await res.json()) as RecommendApiResponse;
        if (!res.ok) throw new Error(json.message ?? `HTTP ${res.status}`);
        return json;
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : t('loadError'));
          setData(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, preferences, nights, travelers, originIata, prefsKey, locale, t]);

  const handleSearchLive = useCallback(
    (iata: string) => {
      onFocusLiveSearch(iata);
    },
    [onFocusLiveSearch],
  );

  if (!enabled || !preferences) return null;

  const destinations = data?.destinations ?? [];

  return (
    <section className="mb-8 sm:mb-12 scroll-mt-20 sm:scroll-mt-24">
      <div className="mb-5 sm:mb-6 text-center md:text-left px-0.5">
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/40 px-3 py-1 text-xs sm:text-sm font-medium text-violet-900 dark:text-violet-200 mb-3">
          <Sparkles className="h-4 w-4 shrink-0" />
          {t('badge')}
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
          {t('title')}
        </h2>
        <p className="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-3xl mx-auto md:mx-0">
          {t('subtitle')}
        </p>
        {data?.disclaimer && (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">{data.disclaimer}</p>
        )}
      </div>

      {loading && (
        <p className="text-center py-8 sm:py-12 text-sm sm:text-base text-gray-600 dark:text-gray-400">
          {t('loading')}
        </p>
      )}

      {error && !loading && (
        <p className="text-center py-8 text-amber-700 dark:text-amber-300">{error}</p>
      )}

      {!loading && !error && destinations.length === 0 && (
        <p className="text-center py-8 text-gray-600 dark:text-gray-400">{t('empty')}</p>
      )}

      {!loading && destinations.length > 0 && (
        <>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 break-words">
            {destinations.length} {t('countLabel')}
            {data?.source ? ` · ${t('source')}: ${data.source}` : ''}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {destinations.map((item) => (
              <RecommendedDestinationCard
                key={item.slug}
                item={item}
                locale={locale}
                labels={cardLabels}
                detailQuery={detailQuery}
                onSearchLive={item.iata ? () => handleSearchLive(item.iata!) : undefined}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
