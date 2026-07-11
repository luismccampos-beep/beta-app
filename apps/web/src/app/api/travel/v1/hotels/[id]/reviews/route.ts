import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiHandler } from '@/lib/api/handler';
import { prisma } from '../../../../../../../lib/prisma';

export const dynamic = 'force-dynamic';

const CreateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional(),
  authorName: z.string().max(120).optional(),
});

async function parseHotelId(ctx: { params: Promise<Record<string, string>> }): Promise<number> {
  const id = parseInt((await ctx.params).id, 10);
  if (!Number.isFinite(id) || id <= 0) throw new z.ZodError([{ code: 'custom', path: ['id'], message: 'Invalid hotel id' }]);
  return id;
}

/** GET avaliações MVP por hotel */
export const GET = apiHandler(async (_req: Request, ctx) => {
  const id = await parseHotelId(ctx);
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
});

/** POST avaliação */
export const POST = apiHandler(async (req: Request, ctx) => {
  const id = await parseHotelId(ctx);
  const hotel = await prisma.wvHotel.findUnique({ where: { id }, select: { id: true } });
  if (!hotel) {
    return NextResponse.json({ ok: false, message: 'Hotel not found' }, { status: 404 });
  }

  const { rating, comment, authorName } = CreateReviewSchema.parse(await req.json());

  const review = await prisma.wvHotelReview.create({
    data: {
      hotelId: id,
      rating,
      comment: comment?.trim().slice(0, 2000) || null,
      authorName: authorName?.trim().slice(0, 120) || null,
    },
  });

  return NextResponse.json({ ok: true, review }, { status: 201 });
});
