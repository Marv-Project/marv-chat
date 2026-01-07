import { z } from 'zod'
import type { UIMessage } from 'ai'

// Metadata schema (all fields optional for backward compatibility)
export const messageMetadataSchema = z.object({
  createdAt: z.number().optional(),
  model: z.string().optional(),
  totalTokens: z.number().optional(),
})

export type MessageMetadata = z.infer<typeof messageMetadataSchema>

// Typed UI message with metadata
export type AppUIMessage = UIMessage<MessageMetadata>
