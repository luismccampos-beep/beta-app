// =============================================================================
// Drizzle D1 client — Cloudflare Workers
// =============================================================================

import { drizzle } from 'drizzle-orm/d1'
import * as schema from './schema'

let _db: ReturnType<typeof drizzle> | null = null

/**
 * Returns a Drizzle instance backed by the D1 binding.
 * On Cloudflare Workers, `env.DB` is the D1 database.
 * In local dev with wrangler, this is auto-configured.
 */
export function getDB(env?: { DB?: D1Database }) {
  if (!_db) {
    if (!env?.DB) {
      throw new Error(
        '[db] D1 binding not found. Ensure DATABASE_DISABLED is "false" and a D1 binding is configured in wrangler.jsonc.',
      )
    }
    _db = drizzle(env.DB, { schema })
  }
  return _db
}

/**
 * Resets the DB instance (useful for testing or wrangler hot-reload).
 */
export function resetDB() {
  _db = null
}

export { schema }
export type DB = ReturnType<typeof getDB>
