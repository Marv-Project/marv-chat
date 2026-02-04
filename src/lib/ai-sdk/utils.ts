import type { UIMessagePart, UITools } from 'ai'
import type { AppUIMessage, CustomUIDataTypes } from '@/lib/ai-sdk/types'
import type { MessageFromDB } from '@/lib/db/schemas'

export const getTextFromMessage = ({
  message,
}: {
  message: AppUIMessage
}): string => {
  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => (part as { type: 'text'; text: string }).text)
    .join('')
}

export const convertToUIMessages = (
  messages: MessageFromDB[],
): AppUIMessage[] => {
  return messages.map((message) => ({
    id: message.id,
    role: message.role,
    parts: message.parts as UIMessagePart<CustomUIDataTypes, UITools>[],
    metadata: {
      createdAt: message.createdAt,
    },
  }))
}
