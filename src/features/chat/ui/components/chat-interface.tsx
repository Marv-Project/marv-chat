import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { CopyIcon, GlobeIcon, RefreshCcwIcon } from 'lucide-react'
import { useState } from 'react'
import { v4 as uuidV4 } from 'uuid'
import type { PromptInputMessage } from '@/components/ai-elements/prompt-input'
import type { AppUIMessage } from '@/lib/ai-sdk/types'
import { Loader } from '@/components/ai-elements/loader'
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
import { cn } from '@/lib/utils'
import {
  Conversation,
  ConversationContent,
  ConversationScrollButtonWithText,
} from '@/components/ai-elements/conversation'

interface ChatLayoutProps {
  chatId: string
  initialMessages?: AppUIMessage[]
}

export const ChatInterface = ({ chatId, initialMessages }: ChatLayoutProps) => {
  const [input, setInput] = useState('')

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

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text)
    const hasAttachments = Boolean(message.files.length)

    if (!(hasText || hasAttachments)) return

    void sendMessage({
      text: message.text || 'Sent with attachments',
      files: message.files,
    })

    setInput('')
  }

  return (
    <>
      <div className="absolute right-0 bottom-2 left-0 z-10 mx-auto flex w-full max-w-3xl gap-2 px-4">
        <div className="w-full">
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

      <div
        className="absolute inset-0 overflow-y-scroll pt-8 sm:pt-3.5"
        style={{
          paddingBottom: '144px',
          scrollbarGutter: 'stable both-edges',
          scrollPaddingBottom: '97px',
        }}
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col space-y-12 px-4 pb-10">
          <Conversation>
            <ConversationContent className="p-0">
              {messages.map((message) => {
                return (
                  <Message
                    key={`${message.id}`}
                    from={message.role}
                    className={cn(
                      message.role === 'assistant' && 'w-full max-w-full',
                    )}
                  >
                    <MessageContent>
                      {message.parts.map((part, i) => {
                        switch (part.type) {
                          case 'text':
                            return (
                              <MessageResponse key={`${message.id}-${i}`}>
                                {part.text}
                              </MessageResponse>
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
                    </MessageContent>
                    {message.role === 'assistant' && (
                      <MessageActions>
                        <MessageAction
                          onClick={() => regenerate()}
                          label="Retry"
                        >
                          <RefreshCcwIcon className="size-3" />
                        </MessageAction>
                        <MessageAction label="Copy">
                          <CopyIcon className="size-3" />
                        </MessageAction>
                      </MessageActions>
                    )}
                  </Message>
                )
              })}

              {(status === 'submitted' || status === 'streaming') && <Loader />}
            </ConversationContent>
            <ConversationScrollButtonWithText className="bottom-40" />
          </Conversation>
        </div>
      </div>
    </>
  )
}
