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

          await prisma.user.update({
            where: { id: session.user.id },
            data: { avatar: null },
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
