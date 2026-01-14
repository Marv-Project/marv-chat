import { db } from '@/lib/db'
import { ChatSDKError } from '@/lib/errors'

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
    console.error('Failed to get chat by id', error)
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
    console.error('Failed to save chat', error)
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
    console.error('Failed to update chat title', error)
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to update chat title',
    )
  }
}
