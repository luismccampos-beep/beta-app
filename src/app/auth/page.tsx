'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { AuthPage } from '../components/pages/AuthPage';

export default function Page() {
  const router = useRouter();

  const onLoginSuccess = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  const onBackToHome = useCallback(() => {
    router.push('/');
  }, [router]);

  const onNavigateToLegal = useCallback(
    (pageType: 'terms' | 'privacy' | 'gdpr' | 'cancellations') => {
      router.push(`/legal/${pageType}`);
    },
    [router],
  );

  return (
    <AuthPage
      onLoginSuccess={onLoginSuccess}
      onBackToHome={onBackToHome}
      onNavigateToLegal={onNavigateToLegal}
    />
  );
}

