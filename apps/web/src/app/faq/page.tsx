'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { FAQPage } from '../components/pages/FAQPage';

export default function Page() {
  const router = useRouter();
  const onBack = useCallback(() => router.back(), [router]);
  return <FAQPage onBack={onBack} />;
}

