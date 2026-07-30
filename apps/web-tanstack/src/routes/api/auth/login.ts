import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { auth } from '@/lib/auth/auth'
import { apiHandler } from '@/lib/api/handler'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const Route = createFileRoute('/api/auth/login')({
  server: {
    handlers: {
      POST: apiHandler(async ({ request }) => {
        const body = LoginSchema.parse(await request.json())

        try {
          await auth.api.signInEmail({
            body: {
              email: body.email,
              password: body.password,
            },
            headers: request.headers,
          })

          return Response.json({ ok: true })
        } catch {
          return Response.json(
            { ok: false, error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' },
            { status: 401 },
          )
        }
      }),
    },
  },
})
