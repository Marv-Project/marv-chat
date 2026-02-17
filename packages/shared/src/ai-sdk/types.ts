import { z } from 'zod'
import type { LanguageModelUsage, UIDataTypes, UIMessage, UITools } from 'ai'

export const messageMetadataSchema = z.object({
  createdAt: z.number().optional(),
  model: z.string().optional(),
  totalTokens: z.custom<LanguageModelUsage>().optional(),
})

export type MessageMetadata = z.infer<typeof messageMetadataSchema>

export type AppUIMessage = UIMessage<MessageMetadata, UIDataTypes, UITools>
