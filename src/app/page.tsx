import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { LandingPage } from './components/pages/LandingPage';

export default async function Page() {
  const session = await auth();

  async function handleGetStarted() {
    'use server';
    const s = await auth();
    redirect(s ? '/preferences/edit' : '/auth');
  }

  return <LandingPage onGetStarted={handleGetStarted} />;
}

