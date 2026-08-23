import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@akmleva/db'
import { sendVerificationEmail } from '@/lib/email'
import { hashToken } from '@/lib/auth/tokens'
import crypto from 'crypto'

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  agreeToTerms: z.literal(true),
})

export const Route = createFileRoute('/api/auth/signup')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          const parsed = RegisterSchema.parse(body)
          const email = parsed.email.trim().toLowerCase()

          const existing = await prisma.user.findFirst({
            where: { email },
            select: { id: true },
          })
          if (existing) {
            return Response.json(
              { error: 'Email already in use', code: 'EMAIL_EXISTS' },
              { status: 409 },
            )
          }

          const bcrypt = await import('bcryptjs')
          const passwordHash = await bcrypt.hash(parsed.password, 12)

          let birthDate: Date | undefined
          if (parsed.birthDate) {
            const [y, m, d] = parsed.birthDate.split('-').map(Number)
            if (y && m && d) birthDate = new Date(Date.UTC(y, m - 1, d))
          }

          const user = await prisma.user.create({
            data: {
              email,
              password: passwordHash,
              name: parsed.name?.trim() ?? null,
            },
            select: { id: true, email: true, name: true },
          })

          // Create profile with signup data
          await prisma.userProfile.create({
            data: {
              userId: user.id,
              phone: parsed.phone?.trim() ?? null,
              birthDate: birthDate ?? null,
              termsAccepted: true,
              acceptedTermsDate: new Date(),
            },
          })

          // Persist the verification token before responding; email can go out async.
          try {
            const token = crypto.randomBytes(32).toString('hex')
            await prisma.emailVerificationToken.create({
              data: {
                userId: user.id,
                token: hashToken(token),
                email: user.email,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
              },
            })
            void sendVerificationEmail({ to: user.email, token }).catch((err) =>
              console.error('[signup] verification email', err),
            )
          } catch (err) {
            console.error('[signup] verify token create', err)
          }

          return Response.json({ ok: true, user })
        } catch (error) {
          if (error instanceof z.ZodError) {
            return Response.json({ error: 'Invalid input', details: error.flatten() }, { status: 400 })
          }
          if (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            (error as { code?: string }).code === 'P2002'
          ) {
            return Response.json(
              { error: 'Email already in use', code: 'EMAIL_EXISTS' },
              { status: 409 },
            )
          }
          console.error('[signup]', error)
          return Response.json({ error: 'Internal server error' }, { status: 500 })
        }
      },
    },
  },
})
