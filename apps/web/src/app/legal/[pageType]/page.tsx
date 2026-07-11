'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { LegalPage } from '../../components/pages/LegalPage';

type PageType = 'terms' | 'privacy' | 'gdpr' | 'cancellations' | 'cookies';

function isPageType(value: string): value is PageType {
  return (
    value === 'terms' ||
    value === 'privacy' ||
    value === 'gdpr' ||
    value === 'cancellations' ||
    value === 'cookies'
  );
}

export default function Page({ params }: { params: Promise<{ pageType: string }> }) {
  const router = useRouter();
  const onBack = useCallback(() => router.back(), [router]);

  const { pageType: rawPageType } = React.use(params);
  const pageType = isPageType(rawPageType) ? rawPageType : 'terms';

  return <LegalPage pageType={pageType} onBack={onBack} />;
}

