import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  ((): PrismaClient => {
    // Strip query params to prevent conflicts
    const url = new URL(process.env.DATABASE_URL!)
    url.search = ""

    const pool = new Pool({
      connectionString: url.toString(),
      ssl: {
        rejectUnauthorized: false
      },
      connectionTimeoutMillis: 15000,
    })

    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
  })()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
