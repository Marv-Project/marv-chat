import {
  boolean,
  foreignKey,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { userTable } from '@marv-chat/db/schemas/auth'

export const threadTable = pgTable(
  'threads',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),
    title: text('title').notNull().default('New Thread'),
    isPinned: boolean('is_pinned').notNull().default(false),
    branchedFromThreadId: uuid('branched_from_thread_id'),
    branchedAtMessageIndex: integer('branched_at_message_index'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at'),
  },
  (table) => [
    foreignKey({
      columns: [table.branchedFromThreadId],
      foreignColumns: [table.id],
    }).onDelete('set null'),
  ],
)
