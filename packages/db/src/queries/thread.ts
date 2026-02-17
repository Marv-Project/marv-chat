import { ChatSDKError } from '@marv-chat/shared'
import { eq } from 'drizzle-orm'
import { baseLogger } from '@marv-chat/logger'
import { db } from '@marv-chat/db'
import { threadTable } from '@marv-chat/db/schemas'

export const getThreadById = async ({ threadId }: { threadId: string }) => {
  try {
    const [thread] = await db
      .select()
      .from(threadTable)
      .where(eq(threadTable.id, threadId))

    if (!thread) return null

    return thread
  } catch {
    throw new ChatSDKError('bad_request:database', 'Failed to get thread by id')
  }
}

export const saveThread = async ({
  threadId,
  userId,
  title,
}: {
  threadId: string
  userId: string
  title: string
}) => {
  try {
    const thread = await db.insert(threadTable).values({
      id: threadId,
      userId,
      title,
      createdAt: new Date(),
    })

    return thread
  } catch {
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
    return await db
      .update(threadTable)
      .set({ title })
      .where(eq(threadTable.id, threadId))
  } catch (error) {
    baseLogger.warn({ threadId, error }, 'Failed to update thread title')
    return
  }
}
