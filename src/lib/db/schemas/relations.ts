import { relations } from 'drizzle-orm'
import { accountTable, sessionTable, userTable } from './auth'
import { messageTable } from './message'
import { streamTable } from './stream'
import { threadTable } from './thread'

// User relations
export const userRelations = relations(userTable, ({ many }) => ({
  sessions: many(sessionTable),
  accounts: many(accountTable),
  threads: many(threadTable),
}))

// Session relations
export const sessionRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}))

// Account relations
export const accountRelations = relations(accountTable, ({ one }) => ({
  user: one(userTable, {
    fields: [accountTable.userId],
    references: [userTable.id],
  }),
}))

// Thread relations
export const threadRelations = relations(threadTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [threadTable.userId],
    references: [userTable.id],
  }),
  branchedFrom: one(threadTable, {
    fields: [threadTable.branchedFromThreadId],
    references: [threadTable.id],
    relationName: 'thread_branches',
  }),
  branches: many(threadTable, {
    relationName: 'thread_branches',
  }),
  messages: many(messageTable),
  streams: many(streamTable),
}))

// Message relations
export const messageRelations = relations(messageTable, ({ one }) => ({
  thread: one(threadTable, {
    fields: [messageTable.threadId],
    references: [threadTable.id],
  }),
}))

// Stream relations
export const streamRelations = relations(streamTable, ({ one }) => ({
  thread: one(threadTable, {
    fields: [streamTable.threadId],
    references: [threadTable.id],
  }),
}))
