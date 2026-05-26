import { NextResponse } from 'next/server';

import { isTravelCatalogDbEnabled } from '../../../../../../../lib/travel/catalog-db';
import { prisma } from '../../../../../../../lib/prisma';

export const dynamic = 'force-dynamic';

type RouteCtx = { params: Promise<{ id: string }> };

/** GET / POST avaliações MVP por hotel */
export async function GET(_req: Request, ctx: RouteCtx) {
  const id = parseInt((await ctx.params).id, 10);
  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ ok: false, message: 'Invalid hotel id' }, { status: 400 });
  }
  if (!isTravelCatalogDbEnabled()) {
    return NextResponse.json({ ok: false, message: 'TRAVEL_CATALOG_SOURCE=db required' }, { status: 503 });
  }

  const reviews = await prisma.wvHotelReview.findMany({
    where: { hotelId: id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const agg = await prisma.wvHotelReview.aggregate({
    where: { hotelId: id },
    _avg: { rating: true },
    _count: { rating: true },
  });

  return NextResponse.json({
    ok: true,
    hotelId: id,
    count: reviews.length,
    averageRating: agg._avg.rating ? Math.round(agg._avg.rating * 10) / 10 : null,
    totalReviews: agg._count.rating,
    reviews,
  });
}

export async function POST(req: Request, ctx: RouteCtx) {
  const id = parseInt((await ctx.params).id, 10);
  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ ok: false, message: 'Invalid hotel id' }, { status: 400 });
  }
  if (!isTravelCatalogDbEnabled()) {
    return NextResponse.json({ ok: false, message: 'TRAVEL_CATALOG_SOURCE=db required' }, { status: 503 });
  }

  const hotel = await prisma.wvHotel.findUnique({ where: { id }, select: { id: true } });
  if (!hotel) {
    return NextResponse.json({ ok: false, message: 'Hotel not found' }, { status: 404 });
  }

  let body: { rating?: number; comment?: string; authorName?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid JSON' }, { status: 400 });
  }

  const rating = body.rating;
  if (rating == null || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { ok: false, message: 'rating must be integer 1–5' },
      { status: 400 },
    );
  }

  const review = await prisma.wvHotelReview.create({
    data: {
      hotelId: id,
      rating,
      comment: body.comment?.trim().slice(0, 2000) || null,
      authorName: body.authorName?.trim().slice(0, 120) || null,
    },
  });

  return NextResponse.json({ ok: true, review }, { status: 201 });
}
