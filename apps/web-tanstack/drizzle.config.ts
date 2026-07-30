// =============================================================================
// Drizzle Kit configuration for Cloudflare D1
// =============================================================================
// Run migrations locally with:
//   npx drizzle-kit generate
//   npx wrangler d1 execute akmleva-db --local --file=./drizzle/migrations/0000_init.sql
// For production:
//   npx wrangler d1 execute akmleva-db --remote --file=./drizzle/migrations/0000_init.sql
// =============================================================================

import type { Config } from 'drizzle-kit'

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID ?? 'local',
    databaseId: process.env.D1_DATABASE_ID ?? 'akmleva-db',
    token: process.env.CLOUDFLARE_API_TOKEN ?? 'local',
  },
} satisfies Config
