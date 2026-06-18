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

  return <LandingPage onGetStarted={onGetStarted} />;
}

