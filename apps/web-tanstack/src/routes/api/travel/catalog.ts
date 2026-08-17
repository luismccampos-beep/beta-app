import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { apiHandler } from '@/lib/api/handler'
import { checkRateLimit, publicRatelimit } from '@/lib/rate-limit'
import { getPreferredDestinationAirportsFromDb } from '@/lib/travel/catalog-db'
import type { TravelCatalogResponse } from '@/lib/api-client'

const CatalogQuerySchema = z.object({
  lang: z.string().optional(),
})

const CABIN_CLASSES: TravelCatalogResponse['duffelCabinClasses'] = [
  { value: 'economy', label: 'Economy' },
  { value: 'premium_economy', label: 'Premium Economy' },
  { value: 'business', label: 'Business' },
  { value: 'first', label: 'First' },
]

const ACCOMMODATIONS: TravelCatalogResponse['accommodations'] = [
  { code: 'HOTEL', label: 'Hotel' },
  { code: 'APARTMENT', label: 'Apartment' },
  { code: 'HOSTEL', label: 'Hostel' },
  { code: 'RESORT', label: 'Resort' },
  { code: 'GUEST_HOUSE', label: 'Guest house' },
  { code: 'POUSADA', label: 'Pousada' },
  { code: 'ECO_LODGE', label: 'Eco lodge' },
  { code: 'VILLA', label: 'Villa' },
  { code: 'CAMPING', label: 'Camping' },
]

export const Route = createFileRoute('/api/travel/catalog')({
  server: {
    handlers: {
      GET: apiHandler(async ({ request }) => {
        const rateLimitResult = await checkRateLimit(request, publicRatelimit)
        if (!rateLimitResult.success) {
          return Response.json({ ok: false, error: 'Rate limit exceeded' }, { status: 429 })
        }

        const url = new URL(request.url)
        const { lang } = CatalogQuerySchema.parse(Object.fromEntries(url.searchParams))

        const errors: { source: string; message: string }[] = []
        let airports: TravelCatalogResponse['airports'] = []
        try {
          airports = await getPreferredDestinationAirportsFromDb({ lang, limit: 800 })
        } catch (e) {
          errors.push({ source: 'db', message: e instanceof Error ? e.message : 'Airports unavailable' })
        }

        const payload: TravelCatalogResponse = {
          configured: { duffel: false, hotelbeds: false, mockHotels: true, siloah: false },
          duffelCabinClasses: CABIN_CLASSES,
          loyaltyProgrammes: [],
          airports,
          accommodations: ACCOMMODATIONS,
          chains: [],
          facilities: [],
          cruiseDestinations: [],
          cruiseBrands: [],
          errors,
        }

        return Response.json(payload)
      }),
    },
  },
})