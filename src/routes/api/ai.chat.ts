import { type AppUIMessage } from '@/lib/ai-sdk/types'
import { generateTitleFromUserMessage } from '@/lib/ai-sdk/utils'
import { logger } from '@/lib/logger'
import {
  getChatById,
  saveChat,
  updateChatTitleById,
} from '@/lib/db/queries/chat.query'
import {
  getMessagesByChatId,
  saveMessages,
} from '@/lib/db/queries/message.query'
import { createStreamId } from '@/lib/db/queries/stream.query'
import { ChatSDKError } from '@/lib/errors'
import { authMiddleware } from '@/middlewares/auth'
import type { PostRequestBodySchema } from '@/schemas/api.schema'
import { postRequestBodySchema } from '@/schemas/api.schema'
import { google, GoogleGenerativeAIProviderOptions } from '@ai-sdk/google'
import { createFileRoute } from '@tanstack/react-router'
import {
  JsonToSseTransformStream,
  convertToModelMessages,
  createUIMessageStream,
  smoothStream,
  stepCountIs,
  streamText,
  validateUIMessages,
} from 'ai'
import { v4 as uuidV4 } from 'uuid'

export const Route = createFileRoute('/api/ai/chat')({
  server: {
    middleware: [authMiddleware],
    handlers: {
      POST: async ({ request, context }) => {
        logger.info({ method: 'POST', path: '/api/ai/chat' }, 'Request received')

        let requestBody: PostRequestBodySchema
        try {
          const json = await request.json()
          requestBody = postRequestBodySchema.parse(json)
        } catch (error) {
          logger.warn({ err: error }, 'Invalid request body')
          return new ChatSDKError('bad_request:api').toResponse()
        }

        try {
          const { id, message } = requestBody

          if (!context.auth) {
            return new ChatSDKError('unauthorized:chat').toResponse()
          }

          const chat = await getChatById(id)
          const messagesFromDb = await getMessagesByChatId(id)
          let titlePromise: Promise<string> | null = null

          if (chat) {
            if (chat.userId !== context.auth.user.id) {
              return new ChatSDKError('forbidden:chat').toResponse()
            }
          } else if (message.role === 'user') {
            // save chat immediately with placeholder title
            await saveChat({
              chatId: id,
              title: 'Untitled',
              userId: context.auth.user.id,
            })

            // start title generation in paralel (don't await)
            titlePromise = generateTitleFromUserMessage({ message })
          }

          const mapUIMessages: AppUIMessage[] = messagesFromDb.map((m) => ({
            id: m.id,
            role: m.role as 'user' | 'assistant' | 'system',
            parts: m.parts as AppUIMessage['parts'],
            metadata: m.metadata as AppUIMessage['metadata'],
          }))
          const messages = [...mapUIMessages, message]
          const validatedMessages = await validateUIMessages({
            messages,
          })

          // Only save user messages to the database (not tool approval responses)
          if (message.role === 'user') {
            await saveMessages({
              messages: [
                {
                  id: message.id,
                  chatId: id,
                  role: 'user',
                  parts: JSON.parse(JSON.stringify(message.parts)),
                  metadata: message.metadata,
                },
              ],
            })
          }

          const streamId = uuidV4()
          await createStreamId({ chatId: id, streamId })

          const modelId = 'gemini-2.5-flash-lite' as const

          const stream = createUIMessageStream({
            originalMessages: messages,
            generateId: () => uuidV4(),
            execute: async ({ writer: dataStream }) => {
              // handle title generation in paralel
              if (titlePromise) {
                void titlePromise
                  .then((title) => {
                    void updateChatTitleById({ chatId: id, title })
                    dataStream.write({
                      type: 'data-chat-title',
                      data: { title },
                    })
                  })
                  .catch((error) => {
                    logger.error({ err: error, chatId: id }, 'Failed to update chat title')
                  })
              }

              const result = streamText({
                model: google(modelId),
                messages: await convertToModelMessages(validatedMessages),
                stopWhen: stepCountIs(5),
                experimental_transform: smoothStream({
                  delayInMs: 20,
                  chunking: 'word',
                }),
                tools: {
                  google_search: google.tools.googleSearch({}),
                  url_context: google.tools.urlContext({}),
                },
                providerOptions: {
                  google: {
                    thinkingConfig: {
                      thinkingBudget: 8192,
                      includeThoughts: true,
                    },
                  } satisfies GoogleGenerativeAIProviderOptions,
                },
              })

              result.consumeStream()

              dataStream.merge(
                result.toUIMessageStream({
                  sendReasoning: true,
                  sendSources: true,
                  messageMetadata: ({ part }) => {
                    if (part.type === 'start') {
                      return {
                        createdAt: new Date(),
                      }
                    }

                    if (part.type === 'finish') {
                      return {
                        modelId,
                        totalTokens: part.totalUsage.totalTokens,
                      }
                    }
                  },
                }),
              )
            },
            onFinish: async ({ messages: finishedMessages }) => {
              if (finishedMessages.length > 0) {
                // normal flow - save all finished messages
                await saveMessages({
                  messages: finishedMessages.map((currentMessage) => ({
                    id: currentMessage.id,
                    chatId: id,
                    role: currentMessage.role,
                    parts: JSON.parse(JSON.stringify(currentMessage.parts)),
                    metadata: currentMessage.metadata,
                  })),
                })
              }
            },
            onError: () => {
              logger.error('Stream generation error')
              return 'Oops, an error occurred while generating the response. Please try again.'
            },
          })

          return new Response(
            stream.pipeThrough(new JsonToSseTransformStream()),
            {
              headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
              },
            },
          )
        } catch (error) {
          if (error instanceof ChatSDKError) {
            return error.toResponse()
          }

          logger.error({ err: error }, 'Unhandled error in chat API')
          return new ChatSDKError('offline:chat').toResponse()
        }
      },
    },
  },
})
