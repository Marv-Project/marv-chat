import { and, asc, count, eq, gte } from 'drizzle-orm'
import type { MessageFromDB } from '@/lib/db/schemas'
import { messageTable, threadTable } from '@/lib/db/schemas'
import { db } from '@/lib/db'
import { ChatSDKError } from '@/lib/errors'
import { logger } from '@/lib/logger'

export async function getMessagesByThreadId({
  threadId,
}: {
  threadId: string
}) {
  try {
    return await db
      .select()
      .from(messageTable)
      .where(eq(messageTable.threadId, threadId))
      .orderBy(asc(messageTable.createdAt))
  } catch (error) {
    logger.error(
      { err: error, threadId },
      'Failed to get messages by thread id',
    )
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to get messages by thread id',
    )
  }
}

export const getMessageCountByUserId = async ({
  id,
  differenceInHours,
}: {
  id: string
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
          eq(threadTable.userId, id),
          gte(messageTable.createdAt, twentyFourHoursAgo),
          eq(messageTable.role, 'user'),
        ),
      )
      .execute()

    return stats.count || 0
  } catch (error) {
    logger.error({ err: error, id }, 'Failed to get message count by user id')
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to get message count by user id',
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
  } catch (error) {
    logger.error({ err: error }, 'Failed to save messages')
    throw new ChatSDKError('bad_request:database', 'Failed to save messages')
  }
}

export async function updateMessage({
  id,
  parts,
  updatedAt,
}: {
  id: string
  parts: MessageFromDB['parts']
  updatedAt: Date
}) {
  try {
    return await db
      .update(messageTable)
      .set({ parts, updatedAt })
      .where(eq(messageTable.id, id))
  } catch (error) {
    logger.error({ err: error, id }, 'Failed to update message')
    throw new ChatSDKError('bad_request:database', 'Failed to update message')
  }
}
