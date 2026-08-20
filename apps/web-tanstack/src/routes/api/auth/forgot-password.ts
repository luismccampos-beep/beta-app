import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { prisma } from '@akmleva/db'
import { sendPasswordResetEmail } from '@/lib/email'
import { hashToken } from '@/lib/auth/tokens'
import crypto from 'crypto'

const ForgotPasswordSchema = z.object({ email: z.string().email() })

export const Route = createFileRoute('/api/auth/forgot-password')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { email } = ForgotPasswordSchema.parse(await request.json())

          const user = await prisma.user.findFirst({
            where: { email },
            select: { id: true, email: true },
          })

          if (user) {
            const token = crypto.randomBytes(32).toString('hex')
            await prisma.user.update({
              where: { id: user.id },
              data: {
                passwordResetToken: hashToken(token),
                passwordResetExpires: new Date(Date.now() + 3600000),
              },
            })
            void sendPasswordResetEmail({ to: user.email, token }).catch((err) =>
              console.error('[forgot-password] Email failed:', err),
            )
          }

          return Response.json({ success: true })
        } catch (error) {
          if (error instanceof z.ZodError) {
            return Response.json({ error: 'Invalid email' }, { status: 400 })
          }
          console.error('[forgot-password]', error)
          return Response.json({ error: 'Internal server error' }, { status: 500 })
        }
      },
    },
  },
})
