import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig } from '@neondatabase/serverless'
import ws from 'ws'
import { env } from '@/configs/env'
import { PrismaClient } from '@/generated/prisma/client'

neonConfig.webSocketConstructor = ws
neonConfig.poolQueryViaFetch = true

const adapter = new PrismaNeon({ connectionString: env.DATABASE_URL })

declare global {
  var __prisma: PrismaClient | undefined
}

export const prisma = globalThis.__prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}
