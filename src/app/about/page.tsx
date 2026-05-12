'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { AboutPage } from '../components/pages/AboutPage';

export default function Page() {
  const router = useRouter();
  const onBack = useCallback(() => router.back(), [router]);
  return <AboutPage onBack={onBack} />;
}

