import { v4 as uuidV4 } from 'uuid'
import type { InputJsonValue } from '@/generated/prisma/internal/prismaNamespace'
import { db } from '@/lib/db'
import { ChatSDKError } from '@/lib/errors'
import { logger } from '@/lib/logger'

export const getChatById = async (chatId: string) => {
  try {
    const selectedChat = await db.chat.findUnique({
      where: {
        id: chatId,
      },
    })

    if (!selectedChat) return null

    return selectedChat
  } catch (error) {
    logger.error({ err: error }, 'Failed to get chat by id')
    throw new ChatSDKError('bad_request:database', 'Failed to get chat by id')
  }
}

export const saveChat = async ({
  chatId,
  title,
  userId,
}: {
  chatId: string
  title: string
  userId: string
}) => {
  try {
    const chat = await db.chat.create({
      data: {
        id: chatId,
        title,
        userId,
      },
    })

    return chat
  } catch (error) {
    logger.error({ err: error }, 'Failed to save chat')
    throw new ChatSDKError('bad_request:database', 'Failed to save chat')
  }
}

export const updateChatTitleById = async ({
  chatId,
  title,
}: {
  chatId: string
  title: string
}) => {
  try {
    const chat = await db.chat.update({
      where: { id: chatId },
      data: { title },
    })

    return chat
  } catch (error) {
    logger.error({ err: error }, 'Failed to update chat title')
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to update chat title',
    )
  }
}

export const branchChat = async ({
  sourceChatId,
  messageIndex,
  userId,
}: {
  sourceChatId: string
  messageIndex: number
  userId: string
}) => {
  try {
    return await db.$transaction(async (tx) => {
      // Get source chat
      const sourceChat = await tx.chat.findUnique({
        where: { id: sourceChatId },
      })

      if (!sourceChat) {
        throw new ChatSDKError('bad_request:database', 'Source chat not found')
      }

      // Get messages up to and including the branch point
      const messages = await tx.message.findMany({
        where: { chatId: sourceChatId },
        orderBy: { createdAt: 'asc' },
        take: messageIndex + 1,
      })

      // Create new branch chat
      const newChatId = uuidV4()
      const newChat = await tx.chat.create({
        data: {
          id: newChatId,
          userId,
          title: `${sourceChat.title} (Branch)`,
          branchedFromId: sourceChatId,
          branchedAtMsgIdx: messageIndex,
        },
      })

      // Copy messages with new UUIDs
      if (messages.length > 0) {
        await tx.message.createMany({
          data: messages.map((msg) => ({
            id: uuidV4(),
            chatId: newChatId,
            role: msg.role,
            parts: msg.parts as InputJsonValue,
            modelId: msg.modelId,
            totalTokens: msg.totalTokens,
            createdAt: msg.createdAt,
          })),
        })
      }

      return newChat
    })
  } catch (error) {
    if (error instanceof ChatSDKError) throw error
    logger.error({ err: error }, 'Failed to branch chat')
    throw new ChatSDKError('bad_request:database', 'Failed to branch chat')
  }
}
