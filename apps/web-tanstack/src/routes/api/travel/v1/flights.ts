import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/travel/v1/flights')({
  server: {
    handlers: {
      GET: async () => {
        // TODO: Fetch from Prisma
        return Response.json({ data: [] })
      },
    },
  },
})
