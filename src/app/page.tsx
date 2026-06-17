'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { LandingPage } from './components/pages/LandingPage';

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const onGetStarted = useCallback(() => {
    if (status === 'loading') return;
    
    if (session) {
      router.push('/preferences/edit');
    } else {
      router.push('/auth');
    }
  }, [router, session, status]);

  const onNavigateToLegal = useCallback(
    (pageType: 'terms' | 'privacy' | 'gdpr' | 'cancellations' | 'cookies') => {
      router.push(`/legal/${pageType}`);
    },
    [router],
  );

  const onNavigateToAbout = useCallback(() => router.push('/about'), [router]);
  const onNavigateToContact = useCallback(() => router.push('/contact'), [router]);
  const onNavigateToFAQ = useCallback(() => router.push('/faq'), [router]);
  const onNavigateToDestinations = useCallback(() => router.push('/destinations'), [router]);

  return (
    <LandingPage
      onGetStarted={onGetStarted}
      onNavigateToDestinations={onNavigateToDestinations}
      onNavigateToLegal={onNavigateToLegal}
      onNavigateToAbout={onNavigateToAbout}
      onNavigateToContact={onNavigateToContact}
      onNavigateToFAQ={onNavigateToFAQ}
    />
  );
}

