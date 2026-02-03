import { index, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import { threadTable } from './thread'

export const streamTable = pgTable(
  'streams',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    threadId: uuid('thread_id')
      .notNull()
      .references(() => threadTable.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index('streams_thread_id_idx').on(table.threadId)],
)
