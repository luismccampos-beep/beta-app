import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { prisma } from '@akmleva/db'
import { auth } from '@/lib/auth/auth'

const preferencesSchema = z.object({
  travelStyle: z.string().optional(),
  favoriteDestinationTypes: z.array(z.string()).optional(),
  favoriteActivities: z.array(z.string()).optional(),
  budgetRangeMin: z.number().optional(),
  budgetRangeMax: z.number().optional(),
  preferredAccommodationType: z.string().optional(),
  tripDuration: z.string().optional(),
  groupSize: z.string().optional(),
  pacePreference: z.string().optional(),
  cuisinePreferences: z.array(z.string()).optional(),
  dietaryRestrictions: z.array(z.string()).optional(),
})

export const Route = createFileRoute('/api/user/preferences/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const session = await auth.api.getSession({ headers: request.headers })
          if (!session?.user) {
            return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
          }

          const preferences = await prisma.userPreference.findUnique({
            where: { userId: session.user.id },
          })

          return Response.json({ ok: true, preferences })
        } catch (error) {
          console.error('[user/preferences]', error)
          return Response.json({ ok: false, error: 'Internal server error' }, { status: 500 })
        }
      },

      PUT: async ({ request }) => {
        try {
          const session = await auth.api.getSession({ headers: request.headers })
          if (!session?.user) {
            return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
          }

          const body = await request.json()
          const data = preferencesSchema.parse(body)

          const preferences = await prisma.userPreference.upsert({
            where: { userId: session.user.id },
            create: { userId: session.user.id, ...data },
            update: data,
          })

          return Response.json({ ok: true, preferences })
        } catch (error) {
          if (error instanceof z.ZodError) {
            return Response.json({ ok: false, error: 'Validation failed', issues: error.issues }, { status: 400 })
          }
          console.error('[user/preferences]', error)
          return Response.json({ ok: false, error: 'Internal server error' }, { status: 500 })
        }
      },
    },
  },
})
