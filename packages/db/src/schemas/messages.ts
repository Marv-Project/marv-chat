import {
  index,
  json,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { threadTable } from '@marv-chat/db/schemas/threads'
import type { InferSelectModel } from 'drizzle-orm'

export const messageRoleEnum = pgEnum('message_role', [
  'user',
  'assistant',
  'system',
])

export const messageTable = pgTable(
  'messages',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    threadId: uuid('thread_id')
      .notNull()
      .references(() => threadTable.id, { onDelete: 'cascade' }),
    role: messageRoleEnum('role').notNull(),
    parts: json('parts').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at'),
  },
  (table) => [index('messages_thread_id_idx').on(table.threadId)],
)

export type MessageFromDB = InferSelectModel<typeof messageTable>
