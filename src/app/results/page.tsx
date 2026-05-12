'use client';

import { Suspense, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { ResultsPage } from '../components/pages/ResultsPage';

export default function Page() {
  const router = useRouter();

  const onBackToHome = useCallback(() => router.push('/'), [router]);
  const onLogout = useCallback(() => router.push('/auth'), [router]);
  const onNavigateToDashboard = useCallback(() => router.push('/dashboard'), [router]);
  const onNavigateToLegal = useCallback(
    (pageType: 'terms' | 'privacy' | 'gdpr' | 'cancellations') => router.push(`/legal/${pageType}`),
    [router],
  );

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-teal-50 to-orange-50">
          <p className="text-gray-600">Loading…</p>
        </div>
      }
    >
      <ResultsPage
        onBackToHome={onBackToHome}
        onLogout={onLogout}
        onNavigateToDashboard={onNavigateToDashboard}
        onNavigateToLegal={onNavigateToLegal}
      />
    </Suspense>
  );
}

