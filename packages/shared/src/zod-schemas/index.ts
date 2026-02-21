import { z } from 'zod'
import type { AppUIMessage } from '../ai-sdk'

export const postBodyRequestSchema = z.object({
  id: z.uuid(),
  message: z.custom<AppUIMessage>(),
})

export type PostBodyRequest = z.infer<typeof postBodyRequestSchema>
