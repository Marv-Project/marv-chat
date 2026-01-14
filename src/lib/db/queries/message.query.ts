import type { Prisma } from '@/generated/prisma/client'
import { db } from '@/lib/db'
import { ChatSDKError } from '@/lib/errors'

export const getMessagesByChatId = async (chatId: string) => {
  try {
    const messages = await db.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
    })

    return messages
  } catch (error) {
    console.error('Failed to get messages by chat id', error)
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
    const createdMessages = await db.message.createMany({
      data: messages,
      skipDuplicates: true,
    })

    return createdMessages
  } catch (error) {
    console.error('Failed to save messages', error)
    throw new ChatSDKError('bad_request:database', 'Failed to save messages')
  }
}
