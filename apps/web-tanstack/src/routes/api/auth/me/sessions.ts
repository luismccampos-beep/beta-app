import { createFileRoute } from '@tanstack/react-router'
import { prisma } from '@akmleva/db'
import { auth } from '@/lib/auth/auth'

export const Route = createFileRoute('/api/auth/me/sessions')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const session = await auth.api.getSession({ headers: request.headers })
          if (!session?.user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
          }

          const sessions = await prisma.session.findMany({
            where: { userId: session.user.id },
            select: {
              id: true,
              expiresAt: true,
              ipAddress: true,
              deviceInfo: true,
              lastUsedAt: true,
              createdAt: true,
              isRevoked: true,
            },
            orderBy: { createdAt: 'desc' },
          })

          return Response.json({ sessions })
        } catch (error) {
          console.error('[me/sessions]', error)
          return Response.json({ error: 'Internal server error' }, { status: 500 })
        }
      },

      DELETE: async ({ request }) => {
        try {
          const session = await auth.api.getSession({ headers: request.headers })
          if (!session?.user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
          }

          const body = (await request.json().catch(() => null)) as { sessionId?: string } | null
          if (body?.sessionId) {
            // Revoke specific session
            await prisma.session.deleteMany({
              where: { id: body.sessionId, userId: session.user.id },
            })
          } else {
            // Revoke all other sessions
            await prisma.session.deleteMany({
              where: {
                userId: session.user.id,
                token: { not: session.session.token },
              },
            })
          }

          return Response.json({ success: true })
        } catch (error) {
          console.error('[me/sessions]', error)
          return Response.json({ error: 'Internal server error' }, { status: 500 })
        }
      },
    },
  },
})
