import type { Prisma } from '@/generated/prisma/client'
import { db } from '@/lib/db'
import { ChatSDKError } from '@/lib/errors'
import { logger } from '@/lib/logger'

export const getMessagesByChatId = async (chatId: string) => {
  try {
    const messages = await db.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
    })

    return messages
  } catch (error) {
    logger.error({ err: error }, 'Failed to get messages by chat id')
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to get messages by chat id',
    )
  }
}

export const saveMessages = async ({
  messages,
}: {
  messages: Prisma.Args<typeof db.message, 'createMany'>['data']
}) => {
  try {
    const result = await db.message.createMany({
      data: messages,
      skipDuplicates: true,
    })

    return result
  } catch (error) {
    logger.error({ err: error }, 'Failed to save messages')
    throw new ChatSDKError('bad_request:database', 'Failed to save messages')
  }
}
