import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

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
      return createStub();
    },
  });
};

export const prisma = isStubMode
  ? (createStub() as PrismaClient)
  : (globalForPrisma.prisma ??
      new PrismaClient({
        log:
          process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
      }));

if (process.env.NODE_ENV !== 'production' && !isStubMode) {
  globalForPrisma.prisma = prisma;
}
