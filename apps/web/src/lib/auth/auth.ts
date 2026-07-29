import { betterAuth } from 'better-auth'
import { customSession, twoFactor } from 'better-auth/plugins'
import { customPrismaAdapter } from './adapter'

const databaseEnabled =
  process.env.NEXT_PHASE !== 'phase-production-build' &&
  process.env.DATABASE_DISABLED !== 'true' &&
  process.env.DISABLE_SSR_FETCH !== 'true';

function hasEnv(value: string | undefined): value is string {
  return typeof value === 'string' && value.length > 0
}

const socialProviders: NonNullable<Parameters<typeof betterAuth>[0]['socialProviders']> = {}
if (hasEnv(process.env.AUTH_GOOGLE_ID) && hasEnv(process.env.AUTH_GOOGLE_SECRET)) {
  socialProviders.google = {
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
  }
}
if (hasEnv(process.env.AUTH_FACEBOOK_ID) && hasEnv(process.env.AUTH_FACEBOOK_SECRET)) {
  socialProviders.facebook = {
    clientId: process.env.AUTH_FACEBOOK_ID,
    clientSecret: process.env.AUTH_FACEBOOK_SECRET,
  }
}

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET || 'local-dev-secret-not-for-production',
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001',
  ...(databaseEnabled ? { database: customPrismaAdapter() as Parameters<typeof betterAuth>[0]['database'] } : {}),
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24,       // 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,              // 5 minutes cache
    },
  },
  pages: {
    signIn: '/auth',
    signUp: '/auth',
  },
  emailAndPassword: {
    enabled: true,
    password: {
      hash: async (password) => {
        const bcrypt = await import('bcryptjs')
        return bcrypt.hash(password, 12)
      },
      verify: async ({ password, hash }) => {
        const bcrypt = await import('bcryptjs')
        return bcrypt.compare(password, hash)
      },
    },
  },
  socialProviders,
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'USER',
        input: false,
      },
      phone: {
        type: 'string',
        required: false,
      },
      birthDate: {
        type: 'date',
        required: false,
      },
    },
  },
  plugins: [
    twoFactor(),
    customSession(async ({ user, session }) => {
      return {
        user: {
          ...user,
          role: (user as Record<string, unknown>).role ?? 'USER',
        },
        session,
      }
    }),
  ],
})

export type Session = typeof auth.$Infer.Session
