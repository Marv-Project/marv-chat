import dotenv from 'dotenv'
import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

dotenv.config({
  path: '../../.env',
})

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    NODE_ENV: z.enum(['development', 'production', 'test']),
    CORS_ORIGIN: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.url(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
