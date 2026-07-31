import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@akmleva/db'
import * as OTPAuth from 'otpauth'

const Enable2FASchema = z.object({
  code: z.string().length(6),
})

const Disable2FASchema = z.object({
  password: z.string().min(1),
})

const APP_NAME = 'AKMLEVA'

export const Route = createFileRoute('/api/auth/me/2fa')({
  server: {
    handlers: {
      // -----------------------------------------------------------------------
      // GET — return current 2FA status, or generate TOTP secret + URI for setup
      // -----------------------------------------------------------------------
      GET: async ({ request }) => {
        try {
          const session = await auth.api.getSession({ headers: request.headers })
          if (!session?.user?.id) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
          }

          const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
              twoFactorEnabled: true,
              email: true,
            },
          })

          if (!user) {
            return Response.json({ error: 'User not found' }, { status: 404 })
          }

          if (user.twoFactorEnabled) {
            return Response.json({ enabled: true })
          }

          // Not enabled — generate a new TOTP secret for setup
          const totp = new OTPAuth.TOTP({
            issuer: APP_NAME,
            label: user.email ?? 'user',
            algorithm: 'SHA1',
            digits: 6,
            period: 30,
            secret: new OTPAuth.Secret({ size: 20 }),
          })

          const uri = totp.toString()
          const secretBase32 = totp.secret.base32

          // Store the secret temporarily (not yet verified/enabled)
          await prisma.user.update({
            where: { id: session.user.id },
            data: { twoFactorSecret: secretBase32 },
          })

          return Response.json({
            enabled: false,
            secret: secretBase32,
            uri,
          })
        } catch (error) {
          console.error('[me/2fa GET]', error)
          return Response.json({ error: 'Internal server error' }, { status: 500 })
        }
      },

      // -----------------------------------------------------------------------
      // POST — enable 2FA after verifying a TOTP code
      // -----------------------------------------------------------------------
      POST: async ({ request }) => {
        try {
          const session = await auth.api.getSession({ headers: request.headers })
          if (!session?.user?.id) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
          }

          const { code } = Enable2FASchema.parse(await request.json())

          const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
              twoFactorSecret: true,
              twoFactorEnabled: true,
              email: true,
            },
          })

          if (!user) {
            return Response.json({ error: 'User not found' }, { status: 404 })
          }

          if (user.twoFactorEnabled) {
            return Response.json(
              { error: '2FA is already enabled' },
              { status: 400 },
            )
          }

          if (!user.twoFactorSecret) {
            return Response.json(
              { error: 'No pending 2FA setup. Please request a new secret first.' },
              { status: 400 },
            )
          }

          const totp = new OTPAuth.TOTP({
            issuer: APP_NAME,
            label: user.email ?? 'user',
            algorithm: 'SHA1',
            digits: 6,
            period: 30,
            secret: OTPAuth.Secret.fromBase32(user.twoFactorSecret),
          })

          const delta = totp.validate({ token: code, window: 1 })

          if (delta === null) {
            return Response.json(
              { error: 'Invalid code. Please check your authenticator app and try again.' },
              { status: 400 },
            )
          }

          // Secret is kept as the active TOTP secret; cleared only on disable.
          // TODO: Add twoFactorBackupCode column to Drizzle schema for backup code support.
          await prisma.user.update({
            where: { id: session.user.id },
            data: { twoFactorEnabled: true },
          })

          return Response.json({ success: true })
        } catch (error) {
          if (error instanceof z.ZodError) {
            return Response.json({ error: 'Invalid input', details: error.flatten() }, { status: 400 })
          }
          console.error('[me/2fa POST]', error)
          return Response.json({ error: 'Internal server error' }, { status: 500 })
        }
      },

      // -----------------------------------------------------------------------
      // DELETE — disable 2FA (requires password verification)
      // -----------------------------------------------------------------------
      DELETE: async ({ request }) => {
        try {
          const session = await auth.api.getSession({ headers: request.headers })
          if (!session?.user?.id) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
          }

          const { password } = Disable2FASchema.parse(await request.json())

          const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
              password: true,
              twoFactorEnabled: true,
            },
          })

          if (!user) {
            return Response.json({ error: 'User not found' }, { status: 404 })
          }

          if (!user.twoFactorEnabled) {
            return Response.json(
              { error: '2FA is not enabled' },
              { status: 400 },
            )
          }

          if (!user.password) {
            return Response.json(
              { error: 'Cannot verify password for this account' },
              { status: 400 },
            )
          }

          const bcrypt = await import('bcryptjs')
          const isValid = await bcrypt.compare(password, user.password)
          if (!isValid) {
            return Response.json(
              { error: 'Incorrect password' },
              { status: 400 },
            )
          }

          await prisma.user.update({
            where: { id: session.user.id },
            data: {
              twoFactorEnabled: false,
              twoFactorSecret: null,
            },
          })

          return Response.json({ success: true })
        } catch (error) {
          if (error instanceof z.ZodError) {
            return Response.json({ error: 'Invalid input', details: error.flatten() }, { status: 400 })
          }
          console.error('[me/2fa DELETE]', error)
          return Response.json({ error: 'Internal server error' }, { status: 500 })
        }
      },
    },
  },
})
