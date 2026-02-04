import { z } from 'zod'
import type { AppUIMessage } from '@/lib/ai-sdk/types'
import { messageMetadataSchema } from '@/lib/ai-sdk/types'

const appUIMessageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  parts: z.array(z.any()),
  metadata: messageMetadataSchema.nullish(),
})

export const postRequestBodySchema = z.object({
  id: z.uuid(),
  message: appUIMessageSchema as z.ZodType<AppUIMessage>,
  selectedChatModel: z.string(),
})

export type PostRequestBodySchema = z.infer<typeof postRequestBodySchema>
