import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/user/preferences')({
  server: {
    handlers: {
      GET: async () => {
        // TODO: Auth guard + fetch from Prisma
        return Response.json({ data: null })
      },
      PUT: async ({ request }) => {
        try {
          const body = await request.json()
          // TODO: Auth guard + update Prisma
          return Response.json({ data: body })
        } catch {
          return Response.json({ error: 'Invalid request' }, { status: 400 })
        }
      },
    },
  },
})
