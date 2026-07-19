import { createFileRoute } from '@tanstack/react-router'
import { prisma } from '@akmleva/db'
import { checkRateLimit, publicRatelimit } from '@/lib/rate-limit'

export const Route = createFileRoute('/api/travel/v1/destinations/countries')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const rateLimitResult = await checkRateLimit(request, publicRatelimit)
        if (!rateLimitResult.success) {
          return Response.json({ ok: false, error: 'Rate limit exceeded' }, { status: 429 })
        }

        const countries = await prisma.$queryRawUnsafe<Array<{ pais: string; paisCode: string; count: bigint }>>(
          `SELECT DISTINCT "pais", "paisCode", COUNT(*)::int as count
           FROM "wv_destinations"
           GROUP BY "pais", "paisCode"
           ORDER BY count DESC`,
        )

        return Response.json({
          ok: true,
          countries: countries.map((c) => ({
            name: c.pais,
            code: c.paisCode,
            count: Number(c.count),
          })),
        })
      },
    },
  },
})
