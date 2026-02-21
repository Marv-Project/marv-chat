import { z } from 'zod'
import type { AppUIMessage } from '../ai-sdk'

const messageSchema = z.custom<AppUIMessage>()

export const postBodyRequestSchema = z.object({
  id: z.uuid(),
  message: messageSchema.optional(),
  messages: z.array(messageSchema).optional(),
})

export type PostBodyRequest = z.infer<typeof postBodyRequestSchema>
