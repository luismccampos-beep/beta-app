import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { prisma } from '@akmleva/db'
import { checkRateLimit, publicRatelimit } from '@/lib/rate-limit'
import { MOCK_DESTINATIONS, MOCK_COUNTRIES } from '@/lib/travel/mock-destinations'

const searchSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
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

        try {
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
            source: 'db',
            items: destinations,
            total,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
          })
        } catch {
          let items = MOCK_DESTINATIONS.map((d) => ({
            id: d.id,
            slug: d.slug,
            nome: d.nome,
            pais: d.pais,
            paisCode: d.paisCode,
            continente: d.continente,
            imagemUrl: d.imagemUrl,
            resumo: d.resumo,
            custoDeVida: d.custoDeVida,
            hotelCount: d.hotelCount,
          }))

          if (q) {
            const lower = q.toLowerCase()
            items = items.filter((d) => d.nome.toLowerCase().includes(lower) || d.slug.toLowerCase().includes(lower))
          }
          if (country) items = items.filter((d) => d.pais === country)
          if (continent) items = items.filter((d) => d.continente === continent)
          if (sort === 'cost') items.sort((a, b) => (a.custoDeVida ?? 0) - (b.custoDeVida ?? 0))
          else items.sort((a, b) => a.nome.localeCompare(b.nome))

          const total = items.length
          const paged = items.slice(skip, skip + limit)

          return Response.json({
            ok: true,
            source: 'mock',
            items: paged,
            total,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
          })
        }
      },
    },
  },
})
