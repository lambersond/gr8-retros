import { PrismaClient } from '@prisma/client'

// One client per server instance. In development the module is re-evaluated on
// every hot reload, so the client is kept on globalThis to avoid opening a new
// connection pool each time.
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
