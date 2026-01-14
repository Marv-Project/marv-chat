import { createFileRoute } from '@tanstack/react-router'
import { formatISO } from 'date-fns'
import { v4 as uuidV4 } from 'uuid'
import {
  JsonToSseTransformStream,
  convertToModelMessages,
  createUIMessageStream,
  stepCountIs,
  streamText,
  validateUIMessages,
} from 'ai'
import type { PostRequestBodySchema } from '@/schemas/api.schema'
import type { AppUIMessage } from '@/lib/ai-sdk/types'
import { authMiddleware } from '@/middlewares/auth'
import { postRequestBodySchema } from '@/schemas/api.schema'
import { ChatSDKError } from '@/lib/errors'
import {
  getChatById,
  saveChat,
  updateChatTitleById,
} from '@/lib/db/queries/chat.query'
import {
  getMessagesByChatId,
  saveMessages,
} from '@/lib/db/queries/message.query'
import { generateTitleFromUserMessage } from '@/lib/ai-sdk/utils'
import { createStreamId } from '@/lib/db/queries/stream.query'
import { registry } from '@/lib/ai-sdk/registry'

export const Route = createFileRoute('/api/ai/chat')({
  server: {
    middleware: [authMiddleware],
    handlers: {
      POST: async ({ request, context }) => {
        let requestBody: PostRequestBodySchema
        try {
          const json = await request.json()
          requestBody = postRequestBodySchema.parse(json)
        } catch (error) {
          console.log('Invalid request body', error)
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
            metadata: {
              createdAt: formatISO(m.createdAt),
            },
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
                },
              ],
            })
          }

          const streamId = uuidV4()
          await createStreamId({ chatId: id, streamId })

          const modelId = 'ollamaV2:gpt-oss:120b'

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
                    console.error('Failed to update chat title:', error)
                  })
              }

              const result = streamText({
                model: registry.languageModel(modelId),
                messages: await convertToModelMessages(validatedMessages),
                stopWhen: stepCountIs(5),
              })

              result.consumeStream()

              dataStream.merge(
                result.toUIMessageStream({
                  sendReasoning: true,
                  messageMetadata: ({ part }) => {
                    if (part.type === 'finish') {
                      console.log('total tokens:', part.totalUsage.totalTokens)
                      return {
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
                    modelId:
                      currentMessage.role === 'assistant' ? modelId : null,
                    totalTokens: currentMessage.metadata?.totalTokens ?? null,
                  })),
                })
              }
            },
            onError: () => {
              console.log(
                'Oops, an error occurred while generating the response. Please try again.',
              )
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

          console.log('Unhandled error in chat API', error)
          return new ChatSDKError('offline:chat').toResponse()
        }
      },
    },
  },
})
