import { registry } from '@/lib/ai-sdk/registry'
import { ChatSDKError } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { authMiddleware } from '@/middlewares/auth'
import { createFileRoute } from '@tanstack/react-router'
import { generateText } from 'ai'
import { z } from 'zod'

const enhancePromptSchema = z.object({
  prompt: z.string().min(1),
})

const enhancePromptSystem = `You are a prompt engineering expert. Your task is to enhance and improve user prompts to be more effective, clear, and detailed.

Rules:
- Make the prompt more specific and detailed
- Add context where helpful
- Improve clarity and structure
- Keep the original intent intact
- Do not add unnecessary complexity
- Return ONLY the enhanced prompt, no explanations or meta-commentary
- If the input is very short or vague, expand it thoughtfully
- Maintain the same language as the input`

export const Route = createFileRoute('/api/ai/enhance-prompt')({
  server: {
    middleware: [authMiddleware],
    handlers: {
      POST: async ({ request, context }) => {
        logger.info({ method: 'POST', path: '/api/ai/enhance-prompt' }, 'Request received')

        try {
          const json = await request.json()
          const { prompt } = enhancePromptSchema.parse(json)

          if (!context.auth) {
            return new ChatSDKError('unauthorized:chat').toResponse()
          }

          const { text: enhanced } = await generateText({
            model: registry.languageModel(
              'openrouter::deepseek/deepseek-r1-0528:free',
            ),
            system: enhancePromptSystem,
            prompt: `Enhance this prompt:\n\n${prompt}`,
          })

          return Response.json({ enhanced: enhanced.trim() })
        } catch (error) {
          if (error instanceof z.ZodError) {
            return new ChatSDKError('bad_request:api').toResponse()
          }

          logger.error({ err: error }, 'Failed to enhance prompt')
          return new ChatSDKError('offline:chat').toResponse()
        }
      },
    },
  },
})
