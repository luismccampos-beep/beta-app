import { PrismaClient } from '@prisma/client';

// NOTE: If you ever hit Neon IP restriction issues on Vercel (e.g. connection
// refused from unknown IPs), switch to the Neon Serverless Driver:
//   1. npm install @neondatabase/serverless @prisma/adapter-neon
//   2. Replace the PrismaClient constructor below with the Neon HTTP adapter:
//
//      import { Pool, neonConfig } from '@neondatabase/serverless';
//      import { PrismaNeon } from '@prisma/adapter-neon';
//      const pool = new Pool({ connectionString: process.env.DATABASE_URL });
//      const adapter = new PrismaNeon(pool);
//      const client = new PrismaClient({ adapter });
//
// See: https://www.prisma.io/docs/orm/prisma-client/deployment/edge/deploy-to-vercel-edge

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalForPrisma = globalThis as unknown as { prisma?: any };

// Bug fix: Next.js sets NEXT_PHASE to phase-production-build (not build).
// Old condition `NEXT_PHASE === 'build'` never matched on Vercel, so the
// stub was dead code and pages tried to reach Neon at build time -> P1001.
const isBuildPhase =
  process.env.NEXT_PHASE?.startsWith('phase-') &&
  process.env.NEXT_PHASE?.endsWith('-build');
const isStubMode =
  isBuildPhase || process.env.DISABLE_SSR_FETCH === 'true';

// Mutations must never silently succeed at build time. If a page tries to
// write during SSG, throw so the bug surfaces instead of becoming a phantom
// success that masks missing dynamism.
const MUTATION_PATTERN =
  /^(create|createMany|update|updateMany|upsert|delete|deleteMany|executeRaw|executeRawUnsafe|\$executeRaw|\$executeRawUnsafe|\$transaction)$/;

const throwOnMutation = (prop: string | symbol) => () => {
  throw new Error(
    `[prisma stub] ${String(prop)}() called during build; the Prisma client is stubbed. Move the call out of page-level SSG or guard it behind dynamic = 'force-dynamic'.`
  );
};

// Recursive Proxy stub: any property access returns another stub; method
// calls resolve to Promise<[]> so .map()/.length run safely during SSG
// without the build ever opening a TCP connection to Postgres.
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
]);

function createPrismaClient() {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

  // Prisma v6: migrate from deprecated $use to $extends.
  // $allOperations lets us hook every query while the raw `client`
  // reference is used for redirected operations (soft delete, findUnique→findFirst).
  const extended = client.$extends({
    query: {
      $allModels: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async $allOperations({ model, operation, args, query }: any) {
          const modelName: string | undefined = model;
          if (!modelName || !SOFT_DELETE_MODELS.has(modelName)) {
            return query(args);
          }

          const lower = modelName.charAt(0).toLowerCase() + modelName.slice(1);

          // Soft delete: convert delete → update on the raw client
          if (operation === 'delete') {
            return (client as any)[lower].update({
              where: args.where ?? {},
              data: { deletedAt: new Date() },
            });
          }
          if (operation === 'deleteMany') {
            return (client as any)[lower].updateMany({
              where: args.where ?? {},
              data: { deletedAt: new Date() },
            });
          }

          // findUnique can't have extra where clauses → fall through to findFirst
          if (operation === 'findUnique') {
            return (client as any)[lower].findFirst({
              ...args,
              where: { ...(args.where ?? {}), deletedAt: null },
            });
          }

          // Read queries: auto-filter deleted rows
          if (operation === 'findFirst' || operation === 'findMany' || operation === 'count') {
            const where = args.where ?? {};
            if (where.deletedAt === undefined) {
              args.where = { ...where, deletedAt: null };
            }
            return query(args);
          }

          // Update queries: only operate on non-deleted rows
          if (operation === 'update' || operation === 'updateMany' || operation === 'upsert') {
            const where = args.where;
            if (where && where.deletedAt === undefined) {
              args.where = { ...where, deletedAt: null };
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
  ? (createStub() as PrismaClient)
  : (globalForPrisma.prisma ?? createPrismaClient());

if (process.env.NODE_ENV !== 'production' && !isStubMode) {
  globalForPrisma.prisma = prisma;
}
