'use client';

import { Suspense, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { DestinationsBrowsePage } from '../components/pages/DestinationsBrowsePage';

function DestinationsBrowseContent() {
  const router = useRouter();
  const onBack = useCallback(() => router.push('/'), [router]);
  return <DestinationsBrowsePage onBack={onBack} />;
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-primary-50 to-accent-50">
          <p className="text-gray-600">Loading…</p>
        </div>
      }
    >
      <DestinationsBrowseContent />
    </Suspense>
  );
}
