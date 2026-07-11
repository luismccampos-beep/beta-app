import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ ok: true, env: process.env.TRAVEL_CATALOG_SOURCE ?? 'not-set' });
}
