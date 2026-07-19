import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/travel/v1/destinations/$slug')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        // TODO: Fetch from Prisma
        return Response.json({
          data: {
            nome: params.slug,
            slug: params.slug,
            pais: 'Portugal',
          },
        })
      },
    },
  },
})
