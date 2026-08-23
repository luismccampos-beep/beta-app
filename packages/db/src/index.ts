import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg-worker';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// The pg-worker adapter is built against an older @prisma/driver-adapter-utils
// than the pinned @prisma/client, so its types are structurally incompatible
// with PrismaClientOptions['adapter'] even though the runtime protocol matches.
type PrismaClientOptions = NonNullable<ConstructorParameters<typeof PrismaClient>[0]>;

// TanStack Start has no NEXT_PHASE build marker, so DISABLE_SSR_FETCH=true is
// the only gate for the build-time stub (used when prerendering pages that
// would otherwise hit the database during the Vite build).
const isStubMode = process.env.DISABLE_SSR_FETCH === 'true';

// Same runtime detection @prisma/pg-worker uses internally: under workerd the
// adapter connects through Cloudflare's sockets instead of node:net, so the
// driver adapter is only used there and Node keeps the native query engine.
const isWorkersRuntime =
  typeof navigator !== 'undefined' &&
  (navigator as { userAgent?: string })?.userAgent === 'Cloudflare-Workers';

const MUTATION_PATTERN =
  /^(create|createMany|update|updateMany|upsert|delete|deleteMany|executeRaw|executeRawUnsafe|\$executeRaw|\$executeRawUnsafe|\$transaction)$/;

const throwOnMutation = (prop: string | symbol) => () => {
  throw new Error(
    `[prisma stub] ${String(prop)}() called during build; the Prisma client is stubbed (DISABLE_SSR_FETCH=true). Move the call out of build-time/SSG code or disable the stub.`
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createStub = (): any => {
  const fn = function () {
    return Promise.resolve([]);
  };
  return new Proxy(fn, {
    get: (_target, prop) => {
      if (
        prop === 'then' ||
        prop === 'catch' ||
        prop === 'finally' ||
        typeof prop === 'symbol'
      ) {
        return undefined;
      }
      if (typeof prop === 'string' && MUTATION_PATTERN.test(prop)) {
        return throwOnMutation(prop);
      }
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[prisma stub] ${String(prop)}() accessed during build – check dynamic export`);
      }
      return createStub();
    },
  });
};

const SOFT_DELETE_MODELS = new Set([
  'AiConversation',
  'AiMessage',
  'Booking',
  'PaymentTransaction',
  'User',
  'Trip',
  'Review',
  'Destination',
  'Package',
  'Provider',
  'Service',
  'Promotion',
  'SavedItinerary',
  'ArticleComment',
  'CrmCategory',
  'CrmProduct',
  'CommunityPost',
  'CommunityComment',
  'RoomMessage',
  'LoyaltyProgram',
]);

function createPrismaClient() {
  const client = isWorkersRuntime
    ? new PrismaClient({
        adapter: new PrismaPg({
          connectionString: process.env.DATABASE_URL,
        }) as unknown as PrismaClientOptions['adapter'],
        log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
      })
    : new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
      });

  const extended = client.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }: { model: string; operation: string; args: Record<string, unknown>; query: (args: Record<string, unknown>) => Promise<unknown> }) {
          const modelName: string | undefined = model;
          if (!modelName || !SOFT_DELETE_MODELS.has(modelName)) {
            return query(args);
          }

          const lower = modelName.charAt(0).toLowerCase() + modelName.slice(1);

          if (operation === 'delete') {
            return (client as unknown as Record<string, { update: (args: Record<string, unknown>) => Promise<unknown> }>)[lower].update({
              where: (args.where ?? {}) as Record<string, unknown>,
              data: { deletedAt: new Date() },
            });
          }
          if (operation === 'deleteMany') {
            return (client as unknown as Record<string, { updateMany: (args: Record<string, unknown>) => Promise<{ count: number }> }>)[lower].updateMany({
              where: (args.where ?? {}) as Record<string, unknown>,
              data: { deletedAt: new Date() },
            });
          }

          if (operation === 'findUnique') {
            return (client as unknown as Record<string, { findFirst: (args: Record<string, unknown>) => Promise<unknown> }>)[lower].findFirst({
              ...args,
              where: { ...(args.where ?? {}) as Record<string, unknown>, deletedAt: null },
            });
          }

          if (operation === 'findUniqueOrThrow' || operation === 'findFirstOrThrow') {
            const found = await (client as unknown as Record<string, { findFirst: (args: Record<string, unknown>) => Promise<unknown> }>)[lower].findFirst({
              ...args,
              where: { ...(args.where ?? {}) as Record<string, unknown>, deletedAt: null },
            });
            if (found === null) {
              throw new PrismaClientKnownRequestError(
                'No record found while filtering soft-deleted rows',
                { code: 'P2025', clientVersion: Prisma.prismaVersion?.client ?? 'unknown' }
              );
            }
            return found;
          }

          if (operation === 'findFirst' || operation === 'findMany' || operation === 'count') {
            const where = (args.where ?? {}) as Record<string, unknown>;
            if (where.deletedAt === undefined) {
              (args as Record<string, unknown>).where = { ...where, deletedAt: null };
            }
            return query(args);
          }

          if (operation === 'aggregate' || operation === 'groupBy') {
            const where = (args.where ?? {}) as Record<string, unknown>;
            if (where.deletedAt === undefined) {
              (args as Record<string, unknown>).where = { ...where, deletedAt: null };
            }
            return query(args);
          }

          if (operation === 'update' || operation === 'updateMany' || operation === 'upsert') {
            const where = (args.where ?? {}) as Record<string, unknown>;
            if (where.deletedAt === undefined) {
              (args as Record<string, unknown>).where = { ...where, deletedAt: null };
            }
            return query(args);
          }

          return query(args);
        },
      },
    },
  });

  return extended;
}

export const prisma = isStubMode
  ? (createStub() as unknown as PrismaClient)
  : (globalForPrisma.prisma ?? createPrismaClient());

if (process.env.NODE_ENV !== 'production' && !isStubMode) {
  globalForPrisma.prisma = prisma as unknown as PrismaClient;
}
