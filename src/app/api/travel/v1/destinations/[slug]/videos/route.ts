import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiHandler } from '@/lib/api/handler';
import { withRateLimit } from '@/lib/api/rate-limit-guard';
import { prisma } from '@/lib/prisma';

export const revalidate = 86400;
export const dynamic = 'force-dynamic';

export const GET = apiHandler(withRateLimit(async (_req: Request, ctx) => {
  const slug = z.string().min(1).max(100).parse((await ctx.params).slug);

  const dest = await prisma.wvDestination.findFirst({
    where: { slug },
    select: {
      id: true,
      videos: {
        where: { isVerified: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  if (!dest) {
    return NextResponse.json({ ok: false, error: 'Destino não encontrado' }, { status: 404 });
  }

  const videos = dest.videos.map((v) => ({
    url: v.url,
    thumbUrl: v.thumbUrl,
    posterUrl: v.posterUrl,
    width: v.width,
    height: v.height,
    durationSec: v.durationSec,
    author: v.author,
    license: v.license,
    sourceUrl: v.sourceUrl,
    isVerified: v.isVerified,
  }));

  return NextResponse.json({ ok: true, count: videos.length, videos });
}));
