import type { MessageFromDB } from '@marv-chat/db/schemas'
import type { AppUIMessage } from './types'
import type { UIDataTypes, UIMessagePart, UITools } from 'ai'

export const getTextFromMessage = (message: AppUIMessage): string => {
  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => (part as { type: 'text'; text: string }).text)
    .join('')
}

export const convertToAppUIMessage = (
  messages: MessageFromDB[],
): AppUIMessage[] => {
  return messages.map((message) => ({
    id: message.id,
    role: message.role,
    parts: message.parts as UIMessagePart<UIDataTypes, UITools>[],
    metadata: message.metadata as AppUIMessage['metadata'],
  }))
}
