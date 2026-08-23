import { createFileRoute } from '@tanstack/react-router'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@akmleva/db'

export const Route = createFileRoute('/api/auth/me/avatar')({
  server: {
    handlers: {
      DELETE: async ({ request }) => {
        try {
          const session = await auth.api.getSession({ headers: request.headers })
          if (!session?.user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
          }

          await prisma.userProfile.upsert({
            where: { userId: session.user.id },
            create: { userId: session.user.id, avatar: null },
            update: { avatar: null },
          })

          return Response.json({ success: true })
        } catch (error) {
          console.error('[me/avatar]', error)
          return Response.json({ error: 'Internal server error' }, { status: 500 })
        }
      },
    },
  },
})
