import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  process.env.NEXT_PHASE === 'build'
    ? ({} as PrismaClient)
    : globalForPrisma.prisma ??
      new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
      });

if (process.env.NODE_ENV !== 'production' && process.env.NEXT_PHASE !== 'build') {
  globalForPrisma.prisma = prisma;
}

