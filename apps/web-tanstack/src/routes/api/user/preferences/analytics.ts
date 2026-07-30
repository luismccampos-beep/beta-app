import { createFileRoute } from '@tanstack/react-router'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@akmleva/db'
import type { Prisma } from '@prisma/client'

export const Route = createFileRoute('/api/user/preferences/analytics')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const session = await auth.api.getSession({ headers: request.headers })
          const body = await request.json().catch(() => ({}))

          const {
            sessionId,
            preferenceType,
            action,
            newValue,
            context,
          } = body as {
            sessionId?: string
            preferenceType?: string
            action?: string
            newValue?: unknown
            context?: unknown
          }

          if (!preferenceType || !action) {
            return Response.json(
              { success: false, message: 'Missing required fields' },
              { status: 400 },
            )
          }

          await prisma.preferenceEvent.create({
            data: {
              userId: session?.user?.id ?? null,
              sessionId: sessionId ?? 'unknown',
              preferenceType,
              action,
              timestamp: new Date(),
              newValue: JSON.parse(JSON.stringify(newValue ?? {})) as Prisma.InputJsonValue,
              context: JSON.parse(JSON.stringify(context ?? {})) as Prisma.InputJsonValue,
            },
          })

          return Response.json({ success: true })
        } catch (error) {
          console.error('[analytics] Failed to save preference event:', error)
          return Response.json(
            { success: false, message: 'Internal error' },
            { status: 500 },
          )
        }
      },
    },
  },
})
