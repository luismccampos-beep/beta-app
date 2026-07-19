import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { prisma } from '@akmleva/db'
import { checkRateLimit, publicRatelimit } from '@/lib/rate-limit'

const searchSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
  destination: z.string().optional(),
})

export const Route = createFileRoute('/api/travel/v1/hotels/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const rateLimitResult = await checkRateLimit(request, publicRatelimit)
        if (!rateLimitResult.success) {
          return Response.json({ ok: false, error: 'Rate limit exceeded' }, { status: 429 })
        }

        const url = new URL(request.url)
        const params = Object.fromEntries(url.searchParams)
        const parsed = searchSchema.safeParse(params)

        if (!parsed.success) {
          return Response.json({ ok: false, error: 'Invalid parameters', issues: parsed.error.issues }, { status: 400 })
        }

        const { page, limit, destination } = parsed.data
        const skip = (page - 1) * limit

        const where: Record<string, unknown> = {}
        if (destination) where.destinoId = destination

        const [hotels, total] = await Promise.all([
          prisma.wvHotel.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
          }),
          prisma.wvHotel.count({ where }),
        ])

        return Response.json({
          ok: true,
          hotels,
          pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        })
      },
    },
  },
})
