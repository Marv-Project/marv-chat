import { z } from 'zod'
import type { AppUIMessage } from '../ai-sdk'

const messageSchema = z.custom<AppUIMessage>()

export const postBodyRequestSchema = z
  .object({
    id: z.uuid(),
    message: messageSchema.optional(),
    messages: z.array(messageSchema).optional(),
  })
  .refine(
    (data) =>
      data.message !== undefined ||
      (data.messages !== undefined && data.messages.length > 0),
    {
      message: 'Either message or a non-empty messages array must be provided',
    },
  )

export type PostBodyRequest = z.infer<typeof postBodyRequestSchema>
