import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { prisma } from '@akmleva/db'

const CreateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional(),
  authorName: z.string().max(120).optional(),
})

function parseHotelId(id: string): number {
  const parsed = parseInt(id, 10)
  if (!Number.isFinite(parsed) || parsed <= 0) throw new z.ZodError([{ code: 'custom', path: ['id'], message: 'Invalid hotel id' }])
  return parsed
}

export const Route = createFileRoute('/api/travel/v1/hotels/$id/reviews')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const id = parseHotelId(params.id)
        const reviews = await prisma.wvHotelReview.findMany({
          where: { hotelId: id },
          orderBy: { createdAt: 'desc' },
          take: 50,
        })

        const agg = await prisma.wvHotelReview.aggregate({
          where: { hotelId: id },
          _avg: { rating: true },
          _count: { rating: true },
        })

        return Response.json({
          ok: true,
          hotelId: id,
          count: reviews.length,
          averageRating: agg._avg.rating ? Math.round(agg._avg.rating * 10) / 10 : null,
          totalReviews: agg._count.rating,
          reviews,
        })
      },

      POST: async ({ request, params }) => {
        const id = parseHotelId(params.id)
        const hotel = await prisma.wvHotel.findUnique({ where: { id }, select: { id: true } })
        if (!hotel) {
          return Response.json({ ok: false, message: 'Hotel not found' }, { status: 404 })
        }

        const { rating, comment, authorName } = CreateReviewSchema.parse(await request.json())

        const review = await prisma.wvHotelReview.create({
          data: {
            hotelId: id,
            rating,
            comment: comment?.trim().slice(0, 2000) || null,
            authorName: authorName?.trim().slice(0, 120) || null,
          },
        })

        return Response.json({ ok: true, review }, { status: 201 })
      },
    },
  },
})
