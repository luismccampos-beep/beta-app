import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/travel/v1/hotels')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const page = parseInt(url.searchParams.get('page') ?? '1')
        // TODO: Fetch from Prisma
        return Response.json({ data: [], pagination: { page, limit: 20, total: 0 } })
      },
    },
  },
})
