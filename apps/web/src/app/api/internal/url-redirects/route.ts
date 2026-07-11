import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requireInternalApiKey } from '@/lib/auth-internal';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const denied = requireInternalApiKey(request);
  if (denied) return denied;

  try {
    const url = new URL(request.url);
    const activeOnly = url.searchParams.get('activeOnly') === 'true';
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '500', 10), 1000);

    const where = activeOnly ? { is_active: true } : {};

    const redirects = await prisma.urlRedirect.findMany({
      where,
      take: limit,
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({ success: true, data: redirects });
  } catch (error) {
    console.error('[internal/url-redirects] Error:', error);
    return NextResponse.json(
      { ok: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
