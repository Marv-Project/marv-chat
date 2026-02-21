import { ChatSDKError } from '@marv-chat/shared'
import { db } from '@marv-chat/db'
import {
  messageTable,
  threadTable,
  type MessageFromDB,
} from '@marv-chat/db/schemas'
import { and, asc, count, eq, gte } from 'drizzle-orm'

export const getMessageCountByUserId = async ({
  userId,
  differenceInHours,
}: {
  userId: string
  differenceInHours: number
}) => {
  try {
    const twentyFourHoursAgo = new Date(
      Date.now() - differenceInHours * 60 * 60 * 1000,
    )

    const [stats] = await db
      .select({ count: count(messageTable.id) })
      .from(messageTable)
      .innerJoin(threadTable, eq(messageTable.threadId, threadTable.id))
      .where(
        and(
          eq(threadTable.userId, userId),
          gte(messageTable.createdAt, twentyFourHoursAgo),
          eq(messageTable.role, 'user'),
        ),
      )
      .execute()

    return stats?.count ?? 0
  } catch {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to get message count by user id',
    )
  }
}

export const getMessagesByThreadId = async ({
  threadId,
}: {
  threadId: string
}) => {
  try {
    const messages = await db
      .select()
      .from(messageTable)
      .where(eq(messageTable.threadId, threadId))
      .orderBy(asc(messageTable.createdAt))

    return messages
  } catch {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to get messages by thread id',
    )
  }
}

export const saveMessages = async ({
  messages,
}: {
  messages: MessageFromDB[]
}) => {
  try {
    return await db.insert(messageTable).values(messages)
  } catch (_error) {
    throw new ChatSDKError('bad_request:database', 'Failed to save messages')
  }
}

export const updateMessageById = async ({
  messageId,
  parts,
  metadata,
  updatedAt,
}: {
  messageId: string
  parts: MessageFromDB['parts']
  metadata: MessageFromDB['metadata']
  updatedAt: MessageFromDB['updatedAt']
}) => {
  try {
    return await db
      .update(messageTable)
      .set({ parts, metadata, updatedAt })
      .where(eq(messageTable.id, messageId))
  } catch (_error) {
    throw new ChatSDKError('bad_request:database', 'Failed to update message')
  }
}
