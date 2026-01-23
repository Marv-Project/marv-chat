import { z } from 'zod'
import type { UIDataTypes, UIMessage } from 'ai'

// Metadata schema (all fields optional for backward compatibility)
export const messageMetadataSchema = z.object({
  modelId: z.string().nullish(),
  createdAt: z.coerce.date().nullish(),
  totalTokens: z.number().nullish(),
})

export type MessageMetadata = z.infer<typeof messageMetadataSchema>

export type CustomUIDataTypes = UIDataTypes & {
  'chat-title': string
}

// Typed UI message with metadata
export type AppUIMessage = UIMessage<MessageMetadata, CustomUIDataTypes>
