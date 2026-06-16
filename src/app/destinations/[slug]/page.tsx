'use client';

import { Suspense, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { DestinationDetailPage } from '../../components/pages/DestinationDetailPage';
import { resultsListPath } from '../../../lib/travel/destination-path';
import { decodeTravelPreferencesCompact } from '../../../lib/travel/travel-preferences-query';

function DestinationDetailContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = typeof params.slug === 'string' ? params.slug : Array.isArray(params.slug) ? params.slug[0] : '';
  const resultsQuery = searchParams.get('rq') ?? '';
  const travelPreferences =
    decodeTravelPreferencesCompact(searchParams.get('prefs')) ??
    decodeTravelPreferencesCompact(
      new URLSearchParams(resultsQuery).get('prefs'),
    );

  const onBackToResults = useCallback(() => {
    router.push(resultsListPath(null, resultsQuery));
  }, [router, resultsQuery]);

  if (!slug) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Destino inválido</p>
      </div>
    );
  }

  return (
    <DestinationDetailPage
      slug={slug}
      resultsSearchQuery={resultsQuery}
      travelPreferences={travelPreferences}
      onBackToResults={onBackToResults}
    />
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/20 to-orange-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
          <div className="h-[42vh] bg-gray-200 dark:bg-gray-800 animate-pulse" />
          <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
            <div className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />
            <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />
          </div>
        </div>
      }
    >
      <DestinationDetailContent />
    </Suspense>
  );
}
