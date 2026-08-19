import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { prisma } from '@akmleva/db'
import { checkRateLimit, publicRatelimit } from '@/lib/rate-limit'

const searchSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
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

        try {
          const where: Record<string, unknown> = {}
          where.NOT = { fonte: 'rejected_geo' }

          if (destination) {
            const numericId = Number(destination)
            const dest = await prisma.wvDestination.findFirst({
              where: {
                OR: [
                  { slug: destination },
                  ...(Number.isInteger(numericId) ? [{ id: numericId }] : []),
                ],
              },
              select: { id: true },
            })

            if (!dest) {
              return Response.json({
                ok: true,
                hotels: [],
                pagination: { page, limit, total: 0, totalPages: 0 },
              })
            }
            where.destinoId = dest.id
          }

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
        } catch (error) {
          console.error('[hotels]', error)
          return Response.json({ ok: false, error: 'Internal server error' }, { status: 500 })
        }
      },
    },
  },
})
