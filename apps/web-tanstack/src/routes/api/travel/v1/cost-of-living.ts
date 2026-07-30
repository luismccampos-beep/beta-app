import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { lookupCostOfLivingDb } from '@/lib/travel/catalog-db'

const CostOfLivingQuerySchema = z.object({
  city: z.string().min(1),
  country: z.string().min(1),
})

export const Route = createFileRoute('/api/travel/v1/cost-of-living')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const { city, country } = CostOfLivingQuerySchema.parse(Object.fromEntries(url.searchParams))

        const result = await lookupCostOfLivingDb(city, country)
        if (!result) {
          return Response.json({ ok: false, message: 'Not found' }, { status: 404 })
        }
        return Response.json({ ok: true, source: 'db', ...result })
      },
    },
  },
})
