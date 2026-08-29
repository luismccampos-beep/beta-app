import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import type { Prisma } from '@prisma/client'
import { prisma } from '@akmleva/db'
import { apiHandler } from '@/lib/api/handler'
import { auth } from '@/lib/auth/auth'
import { checkRateLimit, publicRatelimit } from '@/lib/rate-limit'

const RecommendationEventSchema = z.object({
  eventType: z.enum(['impression', 'click', 'dismiss', 'dwell', 'save']),
  itemId: z.string().min(1).max(64),
  surface: z.string().min(1).max(50),
  position: z.number().int().min(0).max(999).default(0),
  sessionId: z.string().max(64).optional(),
  model: z.string().max(50).optional(),
  score: z.number().min(-1).max(1e6).optional(),
  /** Seconds spent on the item (dwell events). */
  dwellSeconds: z.number().min(0).max(3600).optional(),
  /** Machine-readable dismiss reason: "too_expensive" | "not_my_style" | "been_there" | ... */
  reason: z.string().max(50).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

const BatchSchema = z.object({
  events: z.array(RecommendationEventSchema).min(1).max(100),
})

export const Route = createFileRoute('/api/ai/recommendation-events')({
  server: {
    handlers: {
      POST: apiHandler(async ({ request }) => {
        const rateLimitResult = await checkRateLimit(request, publicRatelimit)
        if (!rateLimitResult.success) {
          return Response.json({ ok: false, message: 'Rate limit exceeded' }, { status: 429 })
        }

        const { events } = BatchSchema.parse(await request.json())

        // Auth is optional: anonymous users still contribute CTR analytics.
        let userId: string | null = null
        try {
          const session = await auth.api.getSession({ headers: request.headers })
          userId = session?.user?.id ?? null
        } catch {
          userId = null
        }

        try {
          const result = await prisma.recommendationEvent.createMany({
            data: events.map((event) => ({
              userId,
              sessionId: event.sessionId ?? null,
              surface: event.surface,
              eventType: event.eventType,
              itemId: event.itemId,
              position: event.position,
              model: event.model ?? null,
              score: event.score ?? null,
              dwellSeconds: event.dwellSeconds ?? null,
              dismissReason: event.reason ?? null,
              metadata: (event.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
            })),
            skipDuplicates: false,
          })

          // Always 200 — telemetry must never break the calling UI.
          return Response.json({ ok: true, logged: result.count })
        } catch (error) {
          console.error('[recommendation-events] Failed to persist events:', error)
          return Response.json({ ok: true, logged: 0 })
        }
      }),
    },
  },
})
