import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { searchAccommodations } from '@/lib/travel/accommodation-search'

const AccommodationSearchSchema = z.object({
  q: z.string().optional(),
  slug: z.string().optional(),
  destinoId: z.coerce.number().int().positive().optional(),
  sources: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
}).refine((data) => data.q || data.slug || data.destinoId, {
  message: 'Provide at least one of: q, slug, destinoId',
  path: ['q'],
})

export const Route = createFileRoute('/api/travel/v1/accommodations/search')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const params = AccommodationSearchSchema.parse(Object.fromEntries(url.searchParams))

        const sources = params.sources
          ? params.sources.split(',').map((s) => s.trim()) as ('wv_hotel' | 'hotel' | 'accommodation')[]
          : undefined

        const result = await searchAccommodations({
          q: params.q,
          slug: params.slug,
          destinoId: params.destinoId,
          sources,
          limit: params.limit,
          offset: params.offset,
        })

        return Response.json(result)
      },
    },
  },
})
