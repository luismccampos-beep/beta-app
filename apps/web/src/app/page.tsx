import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { LandingPage } from './components/pages/LandingPage';

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });

  async function handleGetStarted() {
    'use server';
    const s = await auth.api.getSession({ headers: await headers() });
    redirect(s ? '/preferences/edit' : '/auth');
  }

  return <LandingPage onGetStarted={handleGetStarted} />;
}

