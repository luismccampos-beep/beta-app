import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import {
  fetchNavitiaJourney,
  isNavitiaConfigured,
  getNavitiaApiKey,
} from '../../../../lib/travel/navitia'

const CoordSchema = z.string().transform((val, ctx) => {
  const parts = val.split(',').map((s) => parseFloat(s.trim()))
  if (parts.length !== 2 || parts.some((n) => !Number.isFinite(n))) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Expected lat,lon' })
    return z.NEVER
  }
  return { lat: parts[0]!, lon: parts[1]! }
})

const NavitiaQuerySchema = z.object({
  from: CoordSchema,
  to: CoordSchema,
  datetime: z.string().optional(),
  datetimeRep: z.enum(['departure', 'arrival']).optional(),
  locale: z.string().default('en'),
})

export const Route = createFileRoute('/api/travel/v1/navitia')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!isNavitiaConfigured()) {
          return Response.json(
            {
              ok: false,
              configured: false,
              message:
                'Navitia API key missing. Add NAVITIA_API_KEY to .env.local — https://navitia.io/signup',
              plans: [],
            },
            { status: 503 },
          )
        }

        const url = new URL(request.url)
        const params = NavitiaQuerySchema.parse(Object.fromEntries(url.searchParams))
        const apiKey = getNavitiaApiKey()!

        const result = await fetchNavitiaJourney(apiKey, {
          from: params.from,
          to: params.to,
          datetime: params.datetime || undefined,
          datetimeRepresents: params.datetimeRep,
          locale: params.locale,
        })

        if (result.error && !result.plans.length) {
          return Response.json(
            { ok: false, configured: true, message: result.error, plans: [], region: result.region },
            { status: 502 },
          )
        }

        return Response.json({
          ok: true,
          configured: true,
          region: result.region,
          plans: result.plans,
        })
      },
    },
  },
})
