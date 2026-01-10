import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { CopyIcon, GlobeIcon, RefreshCcwIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { v4 as uuidV4 } from 'uuid'
import type { PromptInputMessage } from '@/components/ai-elements/prompt-input'
import type { AppUIMessage } from '@/lib/ai-sdk/types'
import { useGenerateTitle } from '@/hooks/chat/use-generate-title'
import {
  Conversation,
  ConversationContent,
  ConversationScrollButtonWithText,
} from '@/components/ai-elements/conversation'
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message'
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input'
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/components/ai-elements/reasoning'
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from '@/components/ai-elements/sources'
import { Loader } from '@/components/ai-elements/loader'
import { cn } from '@/lib/utils'

interface ChatLayoutProps {
  chatId?: string
  initialMessages?: AppUIMessage[]
  onFirstPrompt?: (message: PromptInputMessage) => void
  initialPrompt?: PromptInputMessage
  onInitialPromptSent?: () => void
}

export const ChatInterface = ({
  chatId,
  initialMessages = [],
  onFirstPrompt,
  initialPrompt,
  onInitialPromptSent,
}: ChatLayoutProps) => {
  const [input, setInput] = useState('')
  const hasAutoSent = useRef(false)
  const { mutate: generateTitle } = useGenerateTitle()

  const { messages, sendMessage, status, regenerate } = useChat({
    id: chatId,
    messages: initialMessages,
    generateId: () => uuidV4(),
    transport: new DefaultChatTransport({
      api: '/api/ai',
      prepareSendMessagesRequest: ({
        body,
        messages: prepareMessages,
        id: prepareId,
      }) => {
        return {
          body: {
            message: prepareMessages[prepareMessages.length - 1],
            id: prepareId,
            ...body,
          },
        }
      },
    }),
  })

  // Auto-send initial prompt from navigation state (when redirected from index)
  // Also trigger title generation in parallel - no latency for streaming response
  useEffect(() => {
    if (initialPrompt && chatId && !hasAutoSent.current) {
      hasAutoSent.current = true

      const promptText = initialPrompt.text || ''

      // Skip if no content to send
      if (!promptText && !initialPrompt.files.length) {
        return
      }

      // Create the user message for title generation
      const userMessage: AppUIMessage = {
        id: uuidV4(),
        role: 'user',
        parts: [{ type: 'text', text: promptText }],
      }

      // Fire both in parallel - streaming response + title generation
      void sendMessage({
        text: promptText,
        files: initialPrompt.files,
      })

      // Generate title in background (doesn't block streaming)
      generateTitle(
        { chatId, message: userMessage },
        {
          onError: (error) => {
            console.error('Failed to generate title:', error)
          },
        },
      )

      onInitialPromptSent?.()
    }
  }, [initialPrompt, chatId, sendMessage, onInitialPromptSent, generateTitle])

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text)
    const hasAttachments = Boolean(message.files.length)

    if (!(hasText || hasAttachments)) return

    // If on index page (no chatId), delegate to parent for navigation
    if (onFirstPrompt) {
      onFirstPrompt(message)
      return
    }

    void sendMessage({
      text: message.text || 'Sent with attachments',
      files: message.files,
    })

    setInput('')
  }

  return (
    <div className="relative flex h-svh min-w-0 flex-col overflow-x-hidden">
      <Conversation>
        <ConversationContent className="mx-auto h-auto w-full max-w-3xl px-6 pt-20 pb-40!">
          {messages.map((message) => {
            const sources = message.parts.filter(
              (part) => part.type === 'source-url',
            )

            return (
              <div key={message.id}>
                {message.role === 'assistant' && sources.length > 0 && (
                  <Sources>
                    <SourcesTrigger count={sources.length} />
                    <SourcesContent>
                      {sources.map((source, i) => (
                        <Source
                          key={`${message.id}-${i}`}
                          href={source.url}
                          title={source.url}
                        />
                      ))}
                    </SourcesContent>
                  </Sources>
                )}
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      return (
                        <Message
                          key={`${message.id}-${i}`}
                          from={message.role}
                          className={cn(
                            message.role === 'assistant' && 'max-w-full',
                          )}
                        >
                          <MessageContent>
                            <MessageResponse>{part.text}</MessageResponse>
                          </MessageContent>
                          {message.role === 'assistant' && (
                            <MessageActions>
                              <MessageAction
                                onClick={() => regenerate()}
                                label="Retry"
                              >
                                <RefreshCcwIcon className="size-3" />
                              </MessageAction>
                              <MessageAction
                                onClick={() =>
                                  navigator.clipboard.writeText(part.text)
                                }
                                label="Copy"
                              >
                                <CopyIcon className="size-3" />
                              </MessageAction>
                            </MessageActions>
                          )}
                        </Message>
                      )
                    case 'reasoning':
                      return (
                        <Reasoning
                          key={`${message.id}-${i}`}
                          className="w-full"
                          isStreaming={
                            status === 'streaming' &&
                            i === message.parts.length - 1 &&
                            message.id === messages.at(-1)?.id
                          }
                        >
                          <ReasoningTrigger />
                          <ReasoningContent>{part.text}</ReasoningContent>
                        </Reasoning>
                      )
                    default:
                      return null
                  }
                })}
              </div>
            )
          })}

          {(status === 'submitted' || status === 'streaming') && <Loader />}
        </ConversationContent>
        <ConversationScrollButtonWithText className="bottom-36" />
      </Conversation>

      <div
        className={cn(
          'absolute right-1/2 bottom-4 left-1/2 z-10 mx-auto flex w-full max-w-3xl -translate-x-1/2 flex-col',
        )}
      >
        <div className={cn('px-4')}>
          <PromptInput
            className="bg-sidebar/65! supports-backdrop-filter:bg-sidebar/65! ring-sidebar-border/75 rounded-lg ring-4 backdrop-blur-sm"
            onSubmit={handleSubmit}
            globalDrop
            multiple
          >
            <PromptInputBody>
              <PromptInputTextarea
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputTools>
                <PromptInputActionMenu>
                  <PromptInputActionMenuTrigger />
                  <PromptInputActionMenuContent>
                    <PromptInputActionAddAttachments />
                  </PromptInputActionMenuContent>
                </PromptInputActionMenu>
                <PromptInputButton>
                  <GlobeIcon size={16} />
                  <span>Search</span>
                </PromptInputButton>
              </PromptInputTools>
              <PromptInputSubmit
                disabled={
                  !input || status === 'streaming' || status === 'submitted'
                }
                status={status}
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  )
}
