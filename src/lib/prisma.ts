import { PrismaClient } from '@prisma/client';

// https://vercel.com/guides/nextjs-prisma-postgres
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  const globalForPrisma = global as unknown as { prisma: PrismaClient };
  prisma = globalForPrisma.prisma || new PrismaClient();
  globalForPrisma.prisma = prisma;
}

export default prisma;