import { betterAuth } from 'better-auth'
import { customSession, twoFactor } from 'better-auth/plugins'
import { customPrismaAdapter } from './adapter'

const databaseEnabled = process.env.DATABASE_DISABLED !== 'true'

const socialProviders: NonNullable<
  Parameters<typeof betterAuth>[0]['socialProviders']
> = {}

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  socialProviders.google = {
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
  }
}

if (process.env.AUTH_FACEBOOK_ID && process.env.AUTH_FACEBOOK_SECRET) {
  socialProviders.facebook = {
    clientId: process.env.AUTH_FACEBOOK_ID,
    clientSecret: process.env.AUTH_FACEBOOK_SECRET,
  }
}

export const auth = betterAuth({
  secret:
    process.env.BETTER_AUTH_SECRET ||
    process.env.AUTH_SECRET ||
    'development-only-secret',

  baseURL:
    process.env.BETTER_AUTH_URL ||
    'https://akmleva.pt',

  ...(databaseEnabled
    ? {
        database: customPrismaAdapter() as Parameters<
          typeof betterAuth
        >[0]['database'],
      }
    : {}),

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
    customSession(async ({ user, session }) => ({
      user: {
        ...user,
        role: (user as Record<string, unknown>).role ?? 'USER',
      },
      session,
    })),
  ],
})

export type Session = typeof auth.$Infer.Session
