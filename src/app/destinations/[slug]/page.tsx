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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-teal-50 to-orange-50">
          <p className="text-gray-600">Loading…</p>
        </div>
      }
    >
      <DestinationDetailContent />
    </Suspense>
  );
}
