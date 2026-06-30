import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Validates the x-api-key header for internal server-to-server calls.
 * Returns null if valid, or a 403 NextResponse if invalid/missing.
 */
export function requireInternalApiKey(request: NextRequest): NextResponse | null {
  const apiKey = request.headers.get('x-api-key');
  const expected = process.env.INTERNAL_API_KEY;

  if (!expected) {
    console.error('[internal] INTERNAL_API_KEY not configured on server');
    return NextResponse.json(
      { ok: false, error: 'Internal API key not configured', code: 'SERVER_MISCONFIGURATION' },
      { status: 500 },
    );
  }

  if (!apiKey || apiKey !== expected) {
    return NextResponse.json(
      { ok: false, error: 'Forbidden', code: 'FORBIDDEN' },
      { status: 403 },
    );
  }

  return null;
}
