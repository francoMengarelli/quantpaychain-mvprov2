// STUB: Prisma disabled for compilation
// Original imports commented out
// import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined;
};

// Mock prisma client for compilation
export const prisma = globalForPrisma.prisma ?? {
  user: {
    findUnique: async () => null,
    findFirst: async () => null,
    create: async () => null,
    update: async () => null,
  },
  document: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async () => null,
  },
  $queryRaw: async () => null,
};

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
