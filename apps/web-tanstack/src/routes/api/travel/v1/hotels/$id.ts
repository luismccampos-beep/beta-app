import { createFileRoute } from '@tanstack/react-router'
import { prisma } from '@akmleva/db'
import { checkRateLimit, publicRatelimit } from '@/lib/rate-limit'

export const Route = createFileRoute('/api/travel/v1/hotels/$id')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const rateLimitResult = await checkRateLimit(request, publicRatelimit)
        if (!rateLimitResult.success) {
          return Response.json({ ok: false, error: 'Rate limit exceeded' }, { status: 429 })
        }

        const id = Number(params.id)
        if (isNaN(id)) {
          return Response.json({ ok: false, error: 'Invalid ID' }, { status: 400 })
        }

        const hotel = await prisma.wvHotel.findUnique({
          where: { id },
        })

        if (!hotel) {
          return Response.json({ ok: false, error: 'Hotel not found' }, { status: 404 })
        }

        return Response.json({ ok: true, hotel })
      },
    },
  },
})
