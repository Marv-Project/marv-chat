import { generateText } from 'ai'
import type { UIMessage } from 'ai'
import type { AppUIMessage } from '@/lib/ai-sdk/types'
import { prisma } from '@/configs/prisma'
import { ollama } from '@/lib/ai-sdk/registry'

export const getChatById = async (id: string) => {
  return prisma.chat.findUnique({
    where: { id },
  })
}

export const createChat = async (id: string, title: string, userId: string) => {
  return prisma.chat.create({
    data: {
      id,
      title,
      userId,
    },
  })
}

export const loadMessages = async (id: string): Promise<AppUIMessage[]> => {
  const dbMessages = await prisma.message.findMany({
    where: { chatId: id },
    orderBy: { createdAt: 'asc' },
  })

  return dbMessages.map((msg) => {
    const metadata = msg.metadata
      ? (msg.metadata as {
          createdAt?: number
          model?: string
          totalTokens?: number
        })
      : { model: msg.model }

    return {
      id: msg.id,
      role: msg.role,
      parts: msg.parts,
      metadata,
    } as AppUIMessage
  })
}

export const generateTitle = async (message: UIMessage) => {
  try {
    const { text } = await generateText({
      model: ollama('gemini-3-flash-preview'),
      system: `\n
                  - you will generate a short title based on the first message a user begins a conversation with
                  - ensure it is not more than 80 characters long
                  - the title should be a summary of the user's message
                  - do not use quotes or colons`,
      prompt: JSON.stringify(message),
    })

    return text
  } catch (error) {
    console.log('Generate title ai error', error)
    return 'Untitled'
  }
}
