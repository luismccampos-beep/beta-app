import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requireInternalApiKey } from '@/lib/auth-internal';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = requireInternalApiKey(request);
  if (denied) return denied;

  try {
    const { id } = await params;

    await prisma.urlRedirect.update({
      where: { id },
      data: {
        visit_count: { increment: 1 },
        last_visited_at: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[internal/url-redirects/visit] Error:', error);
    return NextResponse.json({ success: true });
  }
}
