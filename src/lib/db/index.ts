import { drizzle } from 'drizzle-orm/node-postgres'

import * as schema from '@/lib/db/schemas'
import { env } from '@/lib/env/server'

export const db = drizzle(env.DATABASE_URL, { schema })
