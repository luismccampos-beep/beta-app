import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { apiHandler } from '@/lib/api/handler'
import { checkRateLimit, publicRatelimit } from '@/lib/rate-limit'
import { prisma } from '@akmleva/db'
import { recommendDestinations, type RecommendedDestination } from '@/lib/travel/trip-recommendation'
import { decodeTravelPreferencesCompact } from '@/lib/travel/travel-preferences-query'
import { MOCK_DESTINATIONS } from '@/lib/travel/mock-destinations'
import type { TravelResult } from '@/lib/api-client'

const ResultsQuerySchema = z.object({
  origin: z.string().optional(),
  departure: z.string().optional(),
  nights: z.coerce.number().int().min(1).default(3),
  adults: z.coerce.number().int().min(1).default(1),
  mode: z.string().optional(),
  tripType: z.string().optional(),
  prefs: z.string().optional(),
  lang: z.string().optional(),
})

type Enrichment = {
  continent?: string | null
  card?: TravelResult['destinationCard']
}

function buildTravelResult(
  d: RecommendedDestination,
  meta: Enrichment,
  nights: number,
  travelers: number,
): TravelResult {
  const price = Math.round(d.cost.tripTotal / Math.max(1, travelers))
  return {
    id: String(d.destinoId),
    destination: d.nome,
    country: d.pais,
    continent: meta.continent ?? '',
    imageUrl: d.imageUrl ?? '',
    aiMatchScore: d.matchPercent ?? Math.round(d.matchScore * 100),
    rating: d.hotel?.estrelas ?? 0,
    reviews: 0,
    duration: nights,
    price,
    priceCurrency: d.cost.currency ?? 'EUR',
    sustainable: true,
    productType: d.tipo,
    description: { en: d.nome, pt: d.nome },
    highlights: [],
    bestFor: [],
    flight: d.cost.flightPerTraveler != null ? { class: 'economy' } : undefined,
    accommodation: d.hotel ? { type: 'hotel' } : undefined,
    destinationSlug: d.slug,
    destinationCard: meta.card,
  }
}

function cardFromDest(dest: (typeof MOCK_DESTINATIONS)[number]): Enrichment {
  return {
    continent: dest.continente,
    card: {
      resumo: dest.resumo,
    },
  }
}

async function enrichDestinations(destinations: RecommendedDestination[], lang: string): Promise<Map<string, Enrichment>> {
  const map = new Map<string, Enrichment>()
  const slugs = destinations.map((d) => d.slug)
  try {
    const rows = await prisma.wvDestination.findMany({
      where: { slug: { in: slugs }, lang },
      select: {
        slug: true,
        continente: true,
        resumo: true,
        veja: true,
        faca: true,
        coma: true,
        dicas: true,
        tags: true,
      },
    })
    for (const row of rows) {
      map.set(row.slug, {
        continent: row.continente,
        card: {
          resumo: row.resumo ?? undefined,
          veja: Array.isArray(row.veja) ? row.veja.map(String) : undefined,
          faca: Array.isArray(row.faca) ? row.faca.map(String) : undefined,
          coma: Array.isArray(row.coma) ? row.coma.map(String) : undefined,
          tags: Array.isArray(row.tags) ? row.tags.map(String) : undefined,
          dicas: (row.dicas as Record<string, string[]> | null) ?? undefined,
        },
      })
    }
  } catch {
    // Fall through to the mock lookup below
  }

  for (const d of destinations) {
    if (map.has(d.slug)) continue
    const mock = MOCK_DESTINATIONS.find((m) => m.slug === d.slug)
    if (mock) map.set(d.slug, cardFromDest(mock))
  }
  return map
}

export const Route = createFileRoute('/api/travel/results')({
  server: {
    handlers: {
      GET: apiHandler(async ({ request }) => {
        const rateLimitResult = await checkRateLimit(request, publicRatelimit)
        if (!rateLimitResult.success) {
          return Response.json({ ok: false, error: 'Rate limit exceeded' }, { status: 429 })
        }

        const url = new URL(request.url)
        const params = ResultsQuerySchema.parse(Object.fromEntries(url.searchParams))

        const prefs = decodeTravelPreferencesCompact(params.prefs)
        if (!prefs) {
          return Response.json({ ok: true, message: 'Provide prefs to search', results: [] })
        }

        const travelers = params.adults
        const { destinations } = await recommendDestinations({
          preferences: prefs,
          nights: params.nights,
          travelers,
          originIata: params.origin?.trim() || undefined,
          limit: 12,
          budgetFilter: true,
          lang: params.lang || 'pt',
        })

        const meta = await enrichDestinations(destinations, params.lang || 'pt')
        const results = destinations.map((d) =>
          buildTravelResult(d, meta.get(d.slug) ?? {}, params.nights, travelers),
        )

        return Response.json({
          ok: true,
          count: results.length,
          results,
        })
      }),
    },
  },
})