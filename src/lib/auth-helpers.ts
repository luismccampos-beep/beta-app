import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== 'admin') {
    return NextResponse.json(
      { ok: false, error: 'Forbidden', code: 'FORBIDDEN' },
      { status: 403 }
    );
  }
  return null;
}
