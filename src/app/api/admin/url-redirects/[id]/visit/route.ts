import { NextResponse } from 'next/server';

export async function POST() {
  // Minimal stub endpoint used by middleware to record visits.
  return NextResponse.json({ success: true });
}

