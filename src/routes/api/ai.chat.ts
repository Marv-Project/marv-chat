import { createFileRoute } from '@tanstack/react-router'
import {
  TypeValidationError,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  smoothStream,
  stepCountIs,
  streamText,
  validateUIMessages,
} from 'ai'
import { v4 as uuidV4 } from 'uuid'
import type { AppUIMessage } from '@/lib/ai-sdk/types'
import type { UserTypeEnum } from '@/lib/db/schemas'
import type { PostRequestBodySchema } from '@/schemas/api.schema'
import { generateTitleFromUserMessage } from '@/lib/ai-sdk/actions'
import { entitlementsByUserType } from '@/lib/ai-sdk/entitlements'
import { messageMetadataSchema } from '@/lib/ai-sdk/types'
import {
  getMessageCountByUserId,
  getMessagesByThreadId,
  saveMessages,
  updateMessage,
} from '@/lib/db/queries/message.query'
import {
  getThreadById,
  saveThread,
  updateThreadTitleById,
} from '@/lib/db/queries/thread.query'
import { ChatSDKError } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { authMiddleware } from '@/middlewares/auth'
import { postRequestBodySchema } from '@/schemas/api.schema'
import { getLanguageModel } from '@/lib/ai-sdk/providers'
import { convertToUIMessages } from '@/lib/ai-sdk/utils'

export const Route = createFileRoute('/api/ai/chat')({
  server: {
    middleware: [authMiddleware],
    handlers: {
      POST: async ({ request, context }) => {
        logger.info(
          { method: 'POST', path: '/api/ai/chat' },
          'Request received',
        )

        let requestBody: PostRequestBodySchema

        try {
          const json = await request.json()
          requestBody = postRequestBodySchema.parse(json)
        } catch (error) {
          logger.warn({ err: error }, 'Invalid request body')
          return new ChatSDKError('bad_request:api').toResponse()
        }

        try {
          const { id, message, selectedChatModel } = requestBody
          logger.info({ requestBody }, 'Request body chat')

          const auth = context.auth

          if (!auth) {
            return new ChatSDKError('unauthorized:chat').toResponse()
          }

          const userType: UserTypeEnum = auth.user.type

          const messageCount = await getMessageCountByUserId({
            id: auth.user.id,
            differenceInHours: 24,
          })

          if (
            messageCount > entitlementsByUserType[userType].maxMessagesPerDay
          ) {
            return new ChatSDKError('rate_limit:chat').toResponse()
          }

          const thread = await getThreadById({ threadId: id })
          const messagesFromDb = await getMessagesByThreadId({ threadId: id })
          let titlePromise: Promise<string> | null = null

          if (thread) {
            if (thread.userId !== auth.user.id) {
              return new ChatSDKError('forbidden:chat').toResponse()
            }
          } else if (message.role === 'user') {
            // save thread immediately with placeholder title
            await saveThread({
              threadId: id,
              title: 'New Thread',
              userId: auth.user.id,
            })

            // start title generation in paralel (don't await)
            titlePromise = generateTitleFromUserMessage({ message })
          }

          let validatedMessages: AppUIMessage[] = []
          const messagesToValidate = [
            ...convertToUIMessages(messagesFromDb),
            message,
          ]

          try {
            validatedMessages = await validateUIMessages({
              messages: messagesToValidate,
              metadataSchema: messageMetadataSchema,
            })
          } catch (error) {
            if (error instanceof TypeValidationError) {
              // Log validation error for monitoring
              logger.error(
                { err: error },
                'Database messages validation failed',
              )
              // Could implement message migration or filtering here
              // For now, start with empty history
              validatedMessages = []
            } else {
              throw error
            }
          }

          // Only save user messages to the database (not tool approval responses)
          if (message.role === 'user') {
            await saveMessages({
              messages: [
                {
                  id: message.id,
                  threadId: id,
                  role: 'user',
                  parts: message.parts,
                  metadata: message.metadata,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              ],
            })
          }

          const stream = createUIMessageStream({
            originalMessages: validatedMessages,
            generateId: () => uuidV4(),
            execute: async ({ writer: dataStream }) => {
              const result = streamText({
                model: getLanguageModel(selectedChatModel),
                messages: await convertToModelMessages(validatedMessages),
                stopWhen: stepCountIs(5),
                experimental_transform: smoothStream({
                  delayInMs: 20,
                  chunking: 'word',
                }),
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
                        modelId: selectedChatModel,
                        totalTokens: part.totalUsage.totalTokens,
                      }
                    }
                  },
                }),
              )

              // handle title generation
              if (titlePromise) {
                const title = await titlePromise
                dataStream.write({
                  type: 'data-chat-title',
                  data: title,
                })
                await updateThreadTitleById({
                  threadId: id,
                  title,
                })
              }
            },

            onFinish: async ({ messages: finishedMessages }) => {
              if (finishedMessages.length > 0) {
                // normal flow - save all finished messages
                await saveMessages({
                  messages: finishedMessages.map((currentMessage) => ({
                    id: currentMessage.id,
                    threadId: id,
                    role: currentMessage.role,
                    parts: currentMessage.parts,
                    metadata: currentMessage.metadata,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  })),
                })
              } else {
                for (const finishedMsg of finishedMessages) {
                  const existingMsg = messagesToValidate.find(
                    (msg) => msg.id === finishedMsg.id,
                  )

                  if (existingMsg) {
                    await updateMessage({
                      id: finishedMsg.id,
                      parts: finishedMsg.parts,
                      updatedAt: new Date(),
                    })
                  } else {
                    await saveMessages({
                      messages: [
                        {
                          id: finishedMsg.id,
                          threadId: id,
                          role: finishedMsg.role,
                          parts: finishedMsg.parts,
                          metadata: finishedMsg.metadata,
                          createdAt: new Date(),
                          updatedAt: new Date(),
                        },
                      ],
                    })
                  }
                }
              }
            },
            onError: () => {
              logger.error('Stream generation error')
              return 'Oops, an error occurred while generating the response. Please try again.'
            },
          })

          return createUIMessageStreamResponse({ stream })
        } catch (error) {
          if (error instanceof ChatSDKError) {
            return error.toResponse()
          }

          if (
            error instanceof Error &&
            error.message.includes(
              'AI Gateway requires a valid credit card on file to service requests',
            )
          ) {
            return new ChatSDKError('bad_request:activate_gateway').toResponse()
          }

          logger.error({ err: error }, 'Unhandled error in chat API')
          return new ChatSDKError('offline:chat').toResponse()
        }
      },
    },
  },
})
