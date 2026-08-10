import { PrismaClient } from "@/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL is required")
}

const globalForPrisma = globalThis as typeof globalThis & {
  __prismaClient?: PrismaClient
};

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: connectionString! })
  return new PrismaClient({ adapter })
}

export const prisma =
  globalForPrisma.__prismaClient ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__prismaClient = prisma
}