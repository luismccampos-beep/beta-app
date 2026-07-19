import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/travel/v1/destinations')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const page = parseInt(url.searchParams.get('page') ?? '1')
        const limit = parseInt(url.searchParams.get('limit') ?? '20')
        // TODO: Fetch from Prisma via createServerFn
        return Response.json({
          data: [],
          pagination: { page, limit, total: 0, totalPages: 0 },
        })
      },
    },
  },
})
