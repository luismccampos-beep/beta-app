'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { LandingPage } from './components/pages/LandingPage';

export default function Page() {
  const router = useRouter();

  const onGetStarted = useCallback(() => {
    fetch('/api/auth/me', { method: 'GET' })
      .then(async (res) => {
        const data = (await res.json().catch(() => ({}))) as { authenticated?: boolean };
        if (res.ok && data.authenticated) {
          router.push('/preferences/edit');
          return;
        }
        router.push('/auth');
      })
      .catch(() => router.push('/auth'));
  }, [router]);

  const onNavigateToLegal = useCallback(
    (pageType: 'terms' | 'privacy' | 'gdpr' | 'cancellations' | 'cookies') => {
      router.push(`/legal/${pageType}`);
    },
    [router],
  );

  const onNavigateToAbout = useCallback(() => router.push('/about'), [router]);
  const onNavigateToContact = useCallback(() => router.push('/contact'), [router]);
  const onNavigateToFAQ = useCallback(() => router.push('/faq'), [router]);

  return (
    <LandingPage
      onGetStarted={onGetStarted}
      onNavigateToLegal={onNavigateToLegal}
      onNavigateToAbout={onNavigateToAbout}
      onNavigateToContact={onNavigateToContact}
      onNavigateToFAQ={onNavigateToFAQ}
    />
  );
}

