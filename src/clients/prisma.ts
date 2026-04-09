import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prismaClientSingleton = () => {
  return new PrismaClient().$extends(withAccelerate())
}

type ExtendedPrismaClient = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma?: ExtendedPrismaClient
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Export typed as PrismaClient to preserve query return type inference
// (include/select narrowing). The Accelerate extension is a transparent
// runtime proxy that adds connection pooling; it only extends query args
// with an optional cacheStrategy which consumers don't need in the type.
export default prisma as unknown as PrismaClient
