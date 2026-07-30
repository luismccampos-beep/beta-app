import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { prisma } from '@akmleva/db'
import { checkRateLimit, publicRatelimit } from '@/lib/rate-limit'

export const Route = createFileRoute('/api/travel/v1/destinations/$slug/videos')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const rateLimitResult = await checkRateLimit(request, publicRatelimit)
        if (!rateLimitResult.success) {
          return Response.json(
            { ok: false, error: 'Too many requests', code: 'RATE_LIMITED' },
            { status: 429 },
          )
        }

        const slug = z.string().min(1).max(100).parse(params.slug)

        const dest = await prisma.wvDestination.findFirst({
          where: { slug },
          select: {
            id: true,
            videos: {
              where: { isVerified: true },
              orderBy: { sortOrder: 'asc' },
            },
          },
        })

        if (!dest) {
          return Response.json({ ok: false, error: 'Destino não encontrado' }, { status: 404 })
        }

        const videos = dest.videos.map((v) => ({
          url: v.url,
          thumbUrl: v.thumbUrl,
          posterUrl: v.posterUrl,
          width: v.width,
          height: v.height,
          durationSec: v.durationSec,
          author: v.author,
          license: v.license,
          sourceUrl: v.sourceUrl,
          isVerified: v.isVerified,
        }))

        return Response.json({ ok: true, count: videos.length, videos })
      },
    },
  },
})
