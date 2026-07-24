'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth/client';

import { DashboardPage } from '../components/pages/DashboardPage';

export default function Page() {
  const router = useRouter();
  const onBack = useCallback(() => router.push('/'), [router]);
  const onLogout = useCallback(() => { signOut(); router.push('/'); }, [router]);
  return <DashboardPage onBack={onBack} onLogout={onLogout} />;
}

