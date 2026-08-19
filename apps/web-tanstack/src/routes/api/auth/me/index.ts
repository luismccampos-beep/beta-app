import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { prisma } from '@akmleva/db'
import { auth } from '@/lib/auth/auth'

const UpdateProfileSchema = z.object({
  name: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  username: z.string().min(3).max(50).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(255).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  state: z.string().max(100).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  preferredLanguage: z.string().max(10).optional(),
})

export const Route = createFileRoute('/api/auth/me/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const session = await auth.api.getSession({ headers: request.headers })
          if (!session?.user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
          }

          const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
              id: true,
              email: true,
              name: true,
              username: true,
              phone: true,
              birthDate: true,
              role: true,
              status: true,
              bio: true,
              avatar: true,
              avatarUrl: true,
              location: true,
              city: true,
              state: true,
              country: true,
              postalCode: true,
              preferredLanguage: true,
              preferredCurrency: true,
              termsAccepted: true,
              acceptedTermsDate: true,
              lastLogin: true,
              joinDate: true,
            },
          })

          return Response.json({ user })
        } catch (error) {
          console.error('[me]', error)
          return Response.json({ error: 'Internal server error' }, { status: 500 })
        }
      },

      PUT: async ({ request }) => {
        try {
          const session = await auth.api.getSession({ headers: request.headers })
          if (!session?.user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
          }

          const body = UpdateProfileSchema.parse(await request.json())
          const data: Record<string, unknown> = {}

          for (const [key, value] of Object.entries(body)) {
            if (value !== undefined) {
              if (key === 'birthDate' && value) {
                const [y, m, d] = (value as string).split('-').map(Number)
                data.birthDate = new Date(Date.UTC(y!, m! - 1, d!))
              } else {
                data[key] = value
              }
            }
          }

          if (Object.keys(data).length === 0) {
            return Response.json({ error: 'No changes provided' }, { status: 400 })
          }

          await prisma.user.update({
            where: { id: session.user.id },
            data,
          })

          return Response.json({ success: true })
        } catch (error) {
          if (error instanceof z.ZodError) {
            return Response.json({ error: 'Invalid input' }, { status: 400 })
          }
          console.error('[me]', error)
          return Response.json({ error: 'Internal server error' }, { status: 500 })
        }
      },
    },
  },
})
