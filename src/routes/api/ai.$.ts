import { createFileRoute } from '@tanstack/react-router'
import { convertToModelMessages, streamText, validateUIMessages } from 'ai'
import { v4 as uuidv4 } from 'uuid'
import type { AppUIMessage } from '@/lib/ai-sdk/types'
import { authMiddleware } from '@/middlewares/auth'
import { createChat, generateTitle, getChatById, loadMessages } from '@/utils'
import { ollama } from '@/lib/ai-sdk/registry'
import { prisma } from '@/configs/prisma'

export const Route = createFileRoute('/api/ai/$')({
  server: {
    middleware: [authMiddleware],
    handlers: {
      POST: async ({ request, context }) => {
        const { id, message }: { id: string; message: AppUIMessage } =
          await request.json()

        console.log(id, message)

        if (!context.auth) {
          return new Response('Unauthorized', { status: 401 })
        }

        let chat = await getChatById(id)

        if (!chat) {
          const title = await generateTitle(message)

          chat = await createChat(id, title, context.auth.user.id)
        }

        // Load previous messages from database
        const previousMessages = await loadMessages(id)
        // Append new message to previousMessages messages
        const newMessages = [...previousMessages, message] as AppUIMessage[]

        const validatedMessages = await validateUIMessages({
          messages: newMessages,
        })

        const result = streamText({
          model: ollama('gpt-oss:120b'),
          messages: await convertToModelMessages(validatedMessages),
          onError: (error) => {
            console.log('Streaming error', error)
          },
        })

        return result.toUIMessageStreamResponse({
          sendSources: true,
          generateMessageId: () => uuidv4(),
          originalMessages: newMessages,
          messageMetadata: ({ part }) => {
            if (part.type === 'start') {
              return {
                createdAt: Date.now(),
                model: 'gpt-oss:120b',
              }
            }
            if (part.type === 'finish') {
              return {
                totalTokens: part.totalUsage.totalTokens,
              }
            }
          },
          onFinish: async ({ messages: onFinishMessages, responseMessage }) => {
            console.log('complete message', responseMessage)
            try {
              await prisma.message.createMany({
                data: onFinishMessages.map((m: AppUIMessage) => ({
                  id: m.id || uuidv4(),
                  chatId: id,
                  role: m.role,
                  parts: JSON.parse(JSON.stringify(m.parts)),
                  metadata: m.metadata
                    ? JSON.parse(JSON.stringify(m.metadata))
                    : null,
                  model: m.metadata?.model ?? 'openai/gpt-oss-120b',
                })),
                skipDuplicates: true,
              })
            } catch (error) {
              console.log('error during saving messages', error)
            }
          },
        })
      },
    },
  },
})
