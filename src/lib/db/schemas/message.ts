import {
  index,
  json,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { threadTable } from './thread'
import type { InferSelectModel } from 'drizzle-orm'
import type { MessageMetadata } from '@/lib/ai-sdk/types'

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
    parts: json('parts').$type<any[]>().notNull(),
    metadata: json('metadata').$type<MessageMetadata | null>(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index('messages_thread_id_idx').on(table.threadId)],
)

export type MessageFromDB = InferSelectModel<typeof messageTable>
