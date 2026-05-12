import { NextResponse } from 'next/server';

export async function GET() {
  // Minimal stub to satisfy middleware during dev.
  // Replace with DB-backed redirects when ready.
  return NextResponse.json({ success: true, data: [] });
}

