import { env } from '@marv-chat/env/server'
import { drizzle } from 'drizzle-orm/node-postgres'

import * as schema from './schemas'

export const db = drizzle(env.DATABASE_URL, { schema })
