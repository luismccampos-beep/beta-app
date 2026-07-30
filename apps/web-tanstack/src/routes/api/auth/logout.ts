import { createFileRoute } from '@tanstack/react-router'
import { auth } from '@/lib/auth/auth'

export const Route = createFileRoute('/api/auth/logout')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        await auth.api.signOut({
          headers: request.headers,
        })
        return Response.json({ success: true })
      },
    },
  },
})
