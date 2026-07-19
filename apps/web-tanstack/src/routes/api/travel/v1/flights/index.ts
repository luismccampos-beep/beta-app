import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { prisma } from '@akmleva/db'
import { checkRateLimit, publicRatelimit } from '@/lib/rate-limit'

const searchSchema = z.object({
  origin: z.string(),
  destination: z.string(),
  date: z.string().optional(),
  passengers: z.coerce.number().default(1),
})

export const Route = createFileRoute('/api/travel/v1/flights/')({
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

        const { origin, destination, date, passengers } = parsed.data

        const flights = await prisma.wvFlight.findMany({
          where: {
            origem: origin,
            destinoIata: destination,
          },
          orderBy: { preco: 'asc' },
          take: 20,
        })

        return Response.json({
          ok: true,
          flights,
          search: { origin, destination, date, passengers },
        })
      },
    },
  },
})
