import { NextResponse } from 'next/server';

export async function POST() {
  // Minimal stub endpoint used by middleware to log 404s.
  return NextResponse.json({ success: true });
}

