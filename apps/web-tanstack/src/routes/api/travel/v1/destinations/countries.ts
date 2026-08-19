import { createFileRoute } from '@tanstack/react-router'
import { prisma } from '@akmleva/db'
import { checkRateLimit, publicRatelimit } from '@/lib/rate-limit'
import { MOCK_COUNTRIES } from '@/lib/travel/mock-destinations'

export const Route = createFileRoute('/api/travel/v1/destinations/countries')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const rateLimitResult = await checkRateLimit(request, publicRatelimit)
        if (!rateLimitResult.success) {
          return Response.json({ ok: false, error: 'Rate limit exceeded' }, { status: 429 })
        }

        try {
          const countries = await prisma.$queryRawUnsafe<Array<{ pais: string; paisCode: string; count: bigint }>>(
            `SELECT DISTINCT "pais", "pais_code" AS "paisCode", COUNT(*)::int as count
             FROM "wv_destinations"
             GROUP BY "pais", "pais_code"
             ORDER BY count DESC`,
          )

          return Response.json({
            ok: true,
            source: 'db',
            countries: countries.map((c) => ({
              name: c.pais,
              code: c.paisCode,
              count: Number(c.count),
            })),
          })
        } catch {
          return Response.json({
            ok: true,
            source: 'mock',
            countries: MOCK_COUNTRIES,
          })
        }
      },
    },
  },
})
