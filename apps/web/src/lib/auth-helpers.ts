import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { headers } from 'next/headers';

export async function getSession() {
  try {
    const h = await headers();
    return await auth.api.getSession({ headers: h });
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session || (session.user as Record<string, unknown>).role !== 'admin') {
    return NextResponse.json(
      { ok: false, error: 'Forbidden', code: 'FORBIDDEN' },
      { status: 403 }
    );
  }
  return null;
}
