import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { prisma } from '@akmleva/db'
import { auth } from '@/lib/auth/auth'
import bcrypt from 'bcryptjs'

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
})

export const Route = createFileRoute('/api/auth/me/password')({
  server: {
    handlers: {
      PUT: async ({ request }) => {
        try {
          const session = await auth.api.getSession({ headers: request.headers })
          if (!session?.user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
          }

          const { currentPassword, newPassword } = ChangePasswordSchema.parse(await request.json())

          const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { id: true, password: true },
          })

          if (!user?.password) {
            return Response.json({ error: 'No password set' }, { status: 400 })
          }

          const valid = await bcrypt.compare(currentPassword, user.password)
          if (!valid) {
            return Response.json({ error: 'Invalid password' }, { status: 400 })
          }

          const hashed = await bcrypt.hash(newPassword, 12)
          await prisma.user.update({
            where: { id: user.id },
            data: { password: hashed, passwordChangedAt: new Date() },
          })

          // Invalidate all sessions except the current one
          await prisma.session.deleteMany({
            where: { userId: user.id, token: { not: session.session.token } },
          })

          return Response.json({ success: true })
        } catch (error) {
          if (error instanceof z.ZodError) {
            return Response.json({ error: 'Invalid input' }, { status: 400 })
          }
          console.error('[me/password]', error)
          return Response.json({ error: 'Internal server error' }, { status: 500 })
        }
      },
    },
  },
})
