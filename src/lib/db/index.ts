import { env } from '@/configs/env'
import { PrismaClient } from '@/generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter =
  env.NODE_ENV === 'development'
    ? new PrismaPg({ connectionString: env.DATABASE_URL })
    : new PrismaNeon({ connectionString: env.DATABASE_URL })

declare global {
  var __prisma: PrismaClient | undefined
}

export const db = globalThis.__prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = db
}
