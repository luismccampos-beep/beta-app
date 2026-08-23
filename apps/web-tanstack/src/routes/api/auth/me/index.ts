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
              role: true,
              status: true,
              lastLogin: true,
              joinDate: true,
              profile: {
                select: {
                  phone: true,
                  birthDate: true,
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
                },
              },
            },
          })

          // Flatten profile fields for backward-compatible API response
          const { profile, ...userFields } = user ?? {}
          return Response.json({ user: { ...userFields, ...(profile ?? {}) } })
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

          // Fields that stay on the User model
          const USER_FIELDS = new Set(['name', 'username'])
          // Fields that moved to UserProfile
          const PROFILE_FIELDS = new Set([
            'phone', 'birthDate', 'bio', 'location', 'city', 'state',
            'country', 'preferredLanguage',
          ])

          const userData: Record<string, unknown> = {}
          const profileData: Record<string, unknown> = {}

          for (const [key, value] of Object.entries(body)) {
            if (value === undefined) continue
            if (USER_FIELDS.has(key)) {
              userData[key] = value
            } else if (PROFILE_FIELDS.has(key)) {
              if (key === 'birthDate' && value) {
                const [y, m, d] = (value as string).split('-').map(Number)
                profileData.birthDate = new Date(Date.UTC(y!, m! - 1, d!))
              } else {
                profileData[key] = value
              }
            }
          }

          if (Object.keys(userData).length === 0 && Object.keys(profileData).length === 0) {
            return Response.json({ error: 'No changes provided' }, { status: 400 })
          }

          // Update user fields
          if (Object.keys(userData).length > 0) {
            await prisma.user.update({
              where: { id: session.user.id },
              data: userData,
            })
          }

          // Upsert profile fields
          if (Object.keys(profileData).length > 0) {
            await prisma.userProfile.upsert({
              where: { userId: session.user.id },
              create: { userId: session.user.id, ...profileData },
              update: profileData,
            })
          }

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
