import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-helpers';

export async function POST() {
  const forbidden = await requireAdmin();
  if (forbidden) return forbidden;

  // Minimal stub endpoint used by middleware to record visits.
  return NextResponse.json({ success: true });
}

