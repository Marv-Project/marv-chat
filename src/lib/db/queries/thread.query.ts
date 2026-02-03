import { v4 as uuidV4 } from 'uuid'
import { asc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { messageTable, threadTable } from '@/lib/db/schemas'
import { ChatSDKError } from '@/lib/errors'
import { logger } from '@/lib/logger'

export const getThreadById = async (threadId: string) => {
  try {
    const [selectedThread] = await db
      .select()
      .from(threadTable)
      .where(eq(threadTable.id, threadId))
      .limit(1)

    if (!selectedThread) return null

    return selectedThread
  } catch (error) {
    logger.error({ err: error }, 'Failed to get thread by id')
    throw new ChatSDKError('bad_request:database', 'Failed to get thread by id')
  }
}

export const saveThread = async ({
  threadId,
  title,
  userId,
}: {
  threadId: string
  title: string
  userId: string
}) => {
  try {
    const [thread] = await db
      .insert(threadTable)
      .values({
        id: threadId,
        title,
        userId,
      })
      .returning()

    return thread
  } catch (error) {
    logger.error({ err: error }, 'Failed to save thread')
    throw new ChatSDKError('bad_request:database', 'Failed to save thread')
  }
}

export const updateThreadTitleById = async ({
  threadId,
  title,
}: {
  threadId: string
  title: string
}) => {
  try {
    const [thread] = await db
      .update(threadTable)
      .set({ title })
      .where(eq(threadTable.id, threadId))
      .returning()

    return thread
  } catch (error) {
    logger.error({ err: error }, 'Failed to update thread title')
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to update thread title',
    )
  }
}

export const branchThread = async ({
  sourceThreadId,
  messageIndex,
  userId,
}: {
  sourceThreadId: string
  messageIndex: number
  userId: string
}) => {
  try {
    return await db.transaction(async (tx) => {
      // Get source thread
      const [sourceThread] = await tx
        .select()
        .from(threadTable)
        .where(eq(threadTable.id, sourceThreadId))
        .limit(1)

      if (!sourceThread) {
        throw new ChatSDKError(
          'bad_request:database',
          'Source thread not found',
        )
      }

      // Get messages up to and including the branch point
      const messages = await tx
        .select()
        .from(messageTable)
        .where(eq(messageTable.threadId, sourceThreadId))
        .orderBy(asc(messageTable.createdAt))
        .limit(messageIndex + 1)

      // Create new branch thread
      const newThreadId = uuidV4()
      const [newThread] = await tx
        .insert(threadTable)
        .values({
          id: newThreadId,
          userId,
          title: `${sourceThread.title} (Branch)`,
          branchedFromThreadId: sourceThreadId,
          branchedAtMessageIndex: messageIndex,
        })
        .returning()

      // Copy messages with new UUIDs
      if (messages.length > 0) {
        const messageValues = messages.map((msg) => ({
          id: uuidV4(),
          threadId: newThreadId,
          role: msg.role,
          parts: msg.parts,
          metadata: msg.metadata,
          createdAt: msg.createdAt,
          updatedAt: msg.updatedAt,
        }))

        await tx.insert(messageTable).values(messageValues)
      }

      return newThread
    })
  } catch (error) {
    if (error instanceof ChatSDKError) throw error
    logger.error({ err: error }, 'Failed to branch thread')
    throw new ChatSDKError('bad_request:database', 'Failed to branch thread')
  }
}
