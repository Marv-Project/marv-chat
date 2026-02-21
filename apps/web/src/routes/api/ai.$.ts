import { createFileRoute } from '@tanstack/react-router'
import {
  ChatSDKError,
  generateUUID,
  postBodyRequestSchema,
} from '@marv-chat/shared'
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
} from 'ai'
import {
  getThreadById,
  saveThread,
  updateThreadTitleById,
} from '@marv-chat/db/queries/thread'
import {
  getMessageCountByUserId,
  getMessagesByThreadId,
  saveMessages,
  updateMessageById,
} from '@marv-chat/db/queries/message'
import { entitlementsByUserType } from '@marv-chat/shared/ai-sdk/entitlements'
import { generateTitleFromUserMessage } from '@marv-chat/shared/ai-sdk/actions'
import { convertToAppUIMessage } from '@marv-chat/shared/ai-sdk/utils'
import { getLanguageModel } from '@marv-chat/shared/ai-sdk/providers'
import { baseLogger } from '@marv-chat/logger'
import type { AppUIMessage, PostBodyRequest } from '@marv-chat/shared'
import type { UserTypeEnum } from '@marv-chat/db/schemas/auth'
import type { MessageFromDB } from '@marv-chat/db/schemas'
import { authMiddleware } from '@/middlewares/auth'

export const Route = createFileRoute('/api/ai/$')({
  server: {
    middleware: [authMiddleware],
    handlers: {
      POST: async ({ context, request }) => {
        let requestBody: PostBodyRequest

        try {
          const json = await request.json()
          requestBody = postBodyRequestSchema.parse(json)
        } catch {
          return new ChatSDKError('bad_request:api').toResponse()
        }

        try {
          const { id, message, messages } = requestBody

          const auth = context.auth

          if (!auth) {
            return new ChatSDKError('unauthorized:chat').toResponse()
          }

          const userType: UserTypeEnum = auth.user.type

          const messageCount = await getMessageCountByUserId({
            userId: auth.user.id,
            differenceInHours: 24,
          })

          if (
            messageCount >= entitlementsByUserType[userType].maxMessagesPerDay
          ) {
            return new ChatSDKError('rate_limit:chat').toResponse()
          }

          const isToolApprovalFlow =
            Array.isArray(messages) && messages.length > 0

          const thread = await getThreadById({ threadId: id })
          let messageFromDb: MessageFromDB[] = []
          let titlePromise: Promise<string> | null = null

          if (thread) {
            if (thread.userId !== auth.user.id) {
              return new ChatSDKError('forbidden:chat').toResponse()
            }

            if (isToolApprovalFlow) {
              messageFromDb = await getMessagesByThreadId({ threadId: id })
            }
          } else if (message?.role === 'user') {
            await saveThread({
              threadId: id,
              userId: auth.user.id,
              title: 'New Thread',
            })

            titlePromise = generateTitleFromUserMessage({ message })
          }

          const uiMessages: AppUIMessage[] = isToolApprovalFlow
            ? convertToAppUIMessage(messageFromDb)
            : [
                ...convertToAppUIMessage(messageFromDb),
                ...(message ? [message] : []),
              ]

          if (message?.role === 'user') {
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

          const modelMessages = await convertToModelMessages(uiMessages)

          const stream = createUIMessageStream({
            originalMessages: isToolApprovalFlow ? uiMessages : undefined,
            execute: async ({ writer: dataStream }) => {
              const result = streamText({
                model: getLanguageModel(),
                messages: modelMessages,
                stopWhen: stepCountIs(5),
              })

              dataStream.merge(
                result.toUIMessageStream({
                  sendReasoning: true,
                  sendSources: true,
                  onError: (error) => {
                    baseLogger.error({ error }, 'Stream error in chat API')
                    return 'Oops, an error occurred!'
                  },
                }),
              )

              if (titlePromise) {
                const title = await titlePromise
                dataStream.write({
                  type: 'data-chat-title',
                  data: title,
                })
                void updateThreadTitleById({ threadId: id, title })
              }
            },
            generateId: generateUUID,
            onFinish: async ({ messages: finishedMessages }) => {
              if (isToolApprovalFlow) {
                for (const finishedMsg of finishedMessages) {
                  const existingMsg = uiMessages.find(
                    (m) => m.id === finishedMsg.id,
                  )

                  if (existingMsg) {
                    await updateMessageById({
                      messageId: finishedMsg.id,
                      parts: finishedMsg.parts,
                      metadata: finishedMsg.metadata,
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
              } else if (finishedMessages.length > 0) {
                await saveMessages({
                  messages: finishedMessages.map((msg) => ({
                    id: msg.id,
                    threadId: id,
                    role: msg.role,
                    parts: msg.parts,
                    metadata: msg.metadata,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  })),
                })
              }
            },
            onError: () => 'Oops, an error occurred!',
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

          console.error('Unhandled error in chat API:', error)
          return new ChatSDKError('offline:chat').toResponse()
        }
      },
    },
  },
})
