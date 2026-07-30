import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { getListingsFromDb } from '../../../../lib/travel/catalog-db'

const ListingsQuerySchema = z.object({
  slug: z.string().optional(),
  destinoId: z.coerce.number().int().positive().optional(),
  type: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(200).default(30),
})

export const Route = createFileRoute('/api/travel/v1/listings')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const params = ListingsQuerySchema.parse(Object.fromEntries(url.searchParams))

        const listings = await getListingsFromDb({ slug: params.slug, destinoId: params.destinoId, type: params.type, limit: params.limit })
        return Response.json({ ok: true, source: 'db', count: listings.length, listings })
      },
    },
  },
})
