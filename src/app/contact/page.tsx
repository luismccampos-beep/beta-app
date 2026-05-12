'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { ContactPage } from '../components/pages/ContactPage';

export default function Page() {
  const router = useRouter();
  const onBack = useCallback(() => router.back(), [router]);
  return <ContactPage onBack={onBack} />;
}

