// =============================================================================
// Drizzle public-only stub — used when DATABASE_DISABLED=true
// =============================================================================
// Exports a `prisma`-compatible proxy for backward compatibility
// with all API routes that import { prisma } from '@akmleva/db'.
// All mutations throw; all reads resolve to empty arrays.
// =============================================================================

const unavailable = (model?: string) => () => {
  throw new Error(
    `[db stub] Database disabled in public-only mode${model ? ` (${model})` : ''}. Set DATABASE_DISABLED=false and configure a D1 binding.`,
  )
}

function createModelProxy(modelName: string) {
  const fn = () => Promise.resolve([])
  return new Proxy(fn, {
    get(_target, prop: string) {
      if (prop === 'then' || prop === 'catch' || prop === 'finally' || typeof prop === 'symbol') {
        return undefined
      }
      if (prop === 'findFirst' || prop === 'findUnique' || prop === 'findOne') {
        return () => Promise.resolve(null)
      }
      if (prop === 'findMany' || prop === 'findAll') {
        return () => Promise.resolve([])
      }
      if (prop === 'count') {
        return () => Promise.resolve(0)
      }
      if (prop === 'create' || prop === 'createMany' || prop === 'update' || prop === 'updateMany' ||
          prop === 'upsert' || prop === 'delete' || prop === 'deleteMany' ||
          prop === '$executeRaw' || prop === '$transaction') {
        return unavailable(modelName)
      }
      return createModelProxy(`${modelName}.${prop}`)
    },
    apply() {
      return Promise.resolve([])
    },
  })
}

// Export `prisma` for backward compatibility with all API routes
// This matches the original db-public-stub.ts from the Prisma era
export const prisma = new Proxy(
  {},
  {
    get(_target, prop: string) {
      if (prop === 'then' || prop === 'catch' || prop === 'finally' || typeof prop === 'symbol') {
        return undefined
      }
      if (prop === '$extends' || prop === '$connect' || prop === '$disconnect') {
        return () => prisma
      }
      if (prop === '$transaction' || prop === '$executeRaw' || prop === '$executeRawUnsafe') {
        return unavailable(prop as string)
      }
      return createModelProxy(prop as string)
    },
  },
)
