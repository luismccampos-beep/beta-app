import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-helpers';

export async function GET() {
  const forbidden = await requireAdmin();
  if (forbidden) return forbidden;

  // Minimal stub to satisfy middleware during dev.
  // Replace with DB-backed redirects when ready.
  return NextResponse.json({ success: true, data: [] });
}

