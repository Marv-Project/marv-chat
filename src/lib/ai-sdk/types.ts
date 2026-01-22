import { z } from 'zod'
import type { UIDataTypes, UIMessage } from 'ai'

// Metadata schema (all fields optional for backward compatibility)
export const messageMetadataSchema = z.object({
  modelId: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  totalTokens: z.number().optional(),
})

export type MessageMetadata = z.infer<typeof messageMetadataSchema>

export type CustomUIDataTypes = UIDataTypes & {
  'chat-title': string
}

// Typed UI message with metadata
export type AppUIMessage = UIMessage<MessageMetadata, CustomUIDataTypes>
