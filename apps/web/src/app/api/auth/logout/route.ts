import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { headers } from 'next/headers';

export async function POST() {
  await auth.api.signOut({
    headers: await headers(),
  });
  return NextResponse.json({ success: true });
}
