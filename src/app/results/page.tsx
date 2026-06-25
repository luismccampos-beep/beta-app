'use client';

import { Suspense, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

import { ResultsPage } from '../components/pages/ResultsPage';

export default function Page() {
  const router = useRouter();
  const onLogout = useCallback(() => signOut({ callbackUrl: '/' }), []);
  const onNavigateToDashboard = useCallback(() => router.push('/dashboard'), [router]);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-teal-50 to-orange-50">
          <p className="text-gray-600">Loading…</p>
        </div>
      }
    >
      <ResultsPage
        onLogout={onLogout}
        onNavigateToDashboard={onNavigateToDashboard}
      />
    </Suspense>
  );
}

