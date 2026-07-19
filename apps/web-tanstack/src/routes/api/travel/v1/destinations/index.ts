import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { prisma } from '@akmleva/db'
import { checkRateLimit, publicRatelimit } from '@/lib/rate-limit'

const searchSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
  q: z.string().optional(),
  country: z.string().optional(),
  continent: z.string().optional(),
  sort: z.enum(['name', 'cost']).default('name'),
})

export const Route = createFileRoute('/api/travel/v1/destinations/')({
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

        const { page, limit, q, country, continent, sort } = parsed.data
        const skip = (page - 1) * limit

        const where: Record<string, unknown> = {}
        if (q) {
          where.OR = [
            { nome: { contains: q, mode: 'insensitive' } },
            { slug: { contains: q, mode: 'insensitive' } },
          ]
        }
        if (country) where.pais = country
        if (continent) where.continente = continent

        const orderBy = sort === 'cost'
          ? { custoDeVida: 'asc' as const }
          : { nome: 'asc' as const }

        const [destinations, total] = await Promise.all([
          prisma.wvDestination.findMany({
            where,
            orderBy,
            skip,
            take: limit,
            select: {
              id: true,
              slug: true,
              nome: true,
              pais: true,
              paisCode: true,
              continente: true,
              imagemUrl: true,
              resumo: true,
              custoDeVida: true,
              hotelCount: true,
            },
          }),
          prisma.wvDestination.count({ where }),
        ])

        return Response.json({
          ok: true,
          destinations,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        })
      },
    },
  },
})
