import { createFileRoute } from '@tanstack/react-router'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@akmleva/db'

export const Route = createFileRoute('/api/user/preferences/draft')({
  server: {
    handlers: {
      PUT: async ({ request }) => {
        try {
          const session = await auth.api.getSession({ headers: request.headers })
          const userId = session?.user?.id
          if (!userId) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
          }

          const body = await request.json().catch(() => null)
          if (!body || typeof body !== 'object') {
            return Response.json({ error: 'Invalid body' }, { status: 400 })
          }

          const { preferences, step } = body as {
            preferences?: unknown
            step?: number
          }

          const existing = await prisma.userPreference.findUnique({
            where: { userId },
            select: { aiSettings: true },
          })
          const existingSettings = (existing?.aiSettings as Record<string, unknown>) ?? {}

          const mergedSettings = {
            ...existingSettings,
            draft: preferences ?? {},
            draftStep: step ?? 0,
            draftUpdatedAt: new Date().toISOString(),
          }

          await prisma.userPreference.upsert({
            where: { userId },
            create: {
              userId,
              aiSettings: mergedSettings,
            },
            update: {
              aiSettings: mergedSettings,
            },
          })

          return Response.json({ success: true })
        } catch (error) {
          console.error('Failed to save draft:', error)
          return Response.json(
            { error: 'Failed to save draft' },
            { status: 500 },
          )
        }
      },

      GET: async ({ request }) => {
        try {
          const session = await auth.api.getSession({ headers: request.headers })
          const userId = session?.user?.id
          if (!userId) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
          }

          const preference = await prisma.userPreference.findUnique({
            where: { userId },
            select: {
              aiSettings: true,
            },
          })

          const settings = preference?.aiSettings as Record<string, unknown> | null
          const draft = settings?.draft ?? null
          const draftStep = settings?.draftStep ?? 0
          const draftUpdatedAt = settings?.draftUpdatedAt ?? null

          return Response.json({
            draft,
            draftStep,
            draftUpdatedAt,
          })
        } catch (error) {
          console.error('Failed to load draft:', error)
          return Response.json(
            { error: 'Failed to load draft' },
            { status: 500 },
          )
        }
      },
    },
  },
})
