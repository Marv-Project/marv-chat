import { z } from 'zod'
import type { AppUIMessage } from '@/lib/ai-sdk/types'
import { messageMetadataSchema } from '@/lib/ai-sdk/types'

const messagePartSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('text'), text: z.string() }),
  z.object({ type: z.literal('reasoning'), text: z.string() }),
  z.object({ type: z.literal('tool-invocation'), toolInvocation: z.record(z.string(), z.unknown()) }),
  z.object({ type: z.literal('source'), source: z.record(z.string(), z.unknown()) }),
  z.object({ type: z.literal('file'), file: z.record(z.string(), z.unknown()) }),
  z.object({ type: z.literal('step-start'), stepStart: z.record(z.string(), z.unknown()) }),
])

const appUIMessageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  parts: z.array(messagePartSchema),
  metadata: messageMetadataSchema.nullish(),
})

export const postRequestBodySchema = z.object({
  id: z.uuid(),
  message: appUIMessageSchema as z.ZodType<AppUIMessage>,
})

export type PostRequestBodySchema = z.infer<typeof postRequestBodySchema>
