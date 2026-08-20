import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { prisma } from '@akmleva/db'
import { hashToken } from '@/lib/auth/tokens'
import bcrypt from 'bcryptjs'

const ResetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
})

export const Route = createFileRoute('/api/auth/reset-password')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { token, password } = ResetPasswordSchema.parse(await request.json())

          const user = await prisma.user.findFirst({
            where: {
              passwordResetToken: hashToken(token),
              passwordResetExpires: { gte: new Date() },
            },
            select: { id: true },
          })

          if (!user) {
            return Response.json({ error: 'Invalid or expired token' }, { status: 400 })
          }

          const hashedPassword = await bcrypt.hash(password, 12)
          await prisma.user.update({
            where: { id: user.id },
            data: {
              password: hashedPassword,
              passwordResetToken: null,
              passwordResetExpires: null,
              passwordChangedAt: new Date(),
            },
          })

          return Response.json({ success: true })
        } catch (error) {
          if (error instanceof z.ZodError) {
            return Response.json({ error: 'Invalid input' }, { status: 400 })
          }
          console.error('[reset-password]', error)
          return Response.json({ error: 'Internal server error' }, { status: 500 })
        }
      },
    },
  },
})
