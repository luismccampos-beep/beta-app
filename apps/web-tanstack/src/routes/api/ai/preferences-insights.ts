import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { apiHandler } from '@/lib/api/handler'
import { auth } from '@/lib/auth/auth'
import { checkRateLimit, publicRatelimit } from '@/lib/rate-limit'
import { unifiedQuery } from '@/lib/ml-service/client'

const PreferencesInsightsSchema = z.object({
  preferences: z.record(z.string(), z.unknown()).default({}),
  locale: z.string().optional().default('pt'),
})

export const Route = createFileRoute('/api/ai/preferences-insights')({
  server: {
    handlers: {
      POST: apiHandler(async ({ request }) => {
        const rateLimitResult = await checkRateLimit(request, publicRatelimit)
        if (!rateLimitResult.success) {
          return Response.json({ ok: false, message: 'Rate limit exceeded' }, { status: 429 })
        }

        const session = await auth.api.getSession({ headers: request.headers })
        if (!session?.user) {
          return Response.json({ ok: false, message: 'Authentication required' }, { status: 401 })
        }

        const { preferences, locale } = PreferencesInsightsSchema.parse(await request.json())

        const query = `Generate short travel insights and recommended next steps based on these preferences:\n\n${JSON.stringify(
          preferences,
          null,
          2,
        )}`

        const data = await unifiedQuery({
          query,
          context: { source: 'web-preferences', locale },
          user_preferences: preferences,
          include_explanation: false,
          include_alternatives: false,
          max_sources: 5,
          language: locale,
        })

        if (!data) {
          return Response.json({
            ok: true,
            answer: null,
            confidence: null,
          })
        }

        if (!data.success) {
          return Response.json(
            {
              ok: false,
              message: data.detail || data.error || 'ML service request failed',
            },
            { status: 502 },
          )
        }

        return Response.json({
          ok: true,
          answer: data.data?.answer ?? '',
          confidence: data.data?.confidence ?? null,
        })
      }),
    },
  },
})
