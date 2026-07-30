import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import {
  enrichPlaceWithWikidataImage,
  searchHotelsViaBizData,
} from '@/lib/travel/osm'

const OsmHotelsQuerySchema = z.object({
  location: z.string().min(1),
  radius_km: z.coerce.number().min(0.1).max(500).default(5),
  radius: z.coerce.number().min(0.1).max(500).optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  enrich: z.string().optional(),
  category: z.string().optional(),
})

export const Route = createFileRoute('/api/travel/v1/hotels/osm')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const params = OsmHotelsQuerySchema.parse(Object.fromEntries(url.searchParams))
        const radiusKm = params.radius_km ?? params.radius ?? 5
        const enrich = params.enrich?.split(',') ?? []
        const withWikidataImages = enrich.includes('wikidata')

        const result = await searchHotelsViaBizData({
          location: params.location,
          radiusKm: Number.isFinite(radiusKm) ? radiusKm : 5,
          limit: params.limit,
          category: params.category?.trim() || 'hotel',
        })

        let places = result.places
        if (withWikidataImages) {
          places = await Promise.all(
            places.map((p) => enrichPlaceWithWikidataImage(p)),
          )
        }

        return Response.json({
          ok: true,
          source: 'osm-bizdata',
          location: params.location,
          locationResolved: result.locationResolved,
          total: result.total,
          count: places.length,
          dataQuality: result.dataQuality,
          hotels: places,
        })
      },
    },
  },
})
