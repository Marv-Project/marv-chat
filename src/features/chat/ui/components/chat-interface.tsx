import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { CopyIcon, GlobeIcon, Loader, RefreshCcwIcon } from 'lucide-react'
import { useState } from 'react'
import type { PromptInputMessage } from '@/components/ai-elements/prompt-input'
import type { AppUIMessage } from '@/lib/ai-sdk/types'
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
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

interface ChatLayoutProps {
  id: string
  initialMessages?: AppUIMessage[]
}

export const ChatInterface = ({ id, initialMessages }: ChatLayoutProps) => {
  const [input, setInput] = useState('')

  const { messages, sendMessage, status, regenerate } = useChat({
    id,
    messages: initialMessages,
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
    <div className="relative size-full">
      <div className="flex h-full flex-col">
        <Conversation className="h-full">
          <ConversationContent className="mx-auto min-h-full w-full max-w-3xl pb-4">
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === 'assistant' &&
                  message.parts.filter((part) => part.type === 'source-url')
                    .length > 0 && (
                    <Sources>
                      <SourcesTrigger
                        count={
                          message.parts.filter(
                            (part) => part.type === 'source-url',
                          ).length
                        }
                      />
                      {message.parts
                        .filter((part) => part.type === 'source-url')
                        .map((part, i) => (
                          <SourcesContent key={`${message.id}-${i}`}>
                            <Source
                              key={`${message.id}-${i}`}
                              href={part.url}
                              title={part.url}
                            />
                          </SourcesContent>
                        ))}
                    </Sources>
                  )}
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      return (
                        <Message key={`${message.id}-${i}`} from={message.role}>
                          <MessageContent>
                            <MessageResponse>{part.text}</MessageResponse>
                          </MessageContent>
                          {message.role === 'assistant' &&
                            i === messages.length - 1 && (
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
            ))}
            {status === 'submitted' && <Loader />}
            <div className="bg-sidebar/65 supports-backdrop-filter:bg-sidebar/65 sticky bottom-4 z-10 mt-auto w-full rounded-md backdrop-blur-sm">
              <PromptInput onSubmit={handleSubmit} globalDrop multiple>
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
                    disabled={!input && !status}
                    status={status}
                  />
                </PromptInputFooter>
              </PromptInput>
            </div>
          </ConversationContent>
          <ConversationScrollButton className="bottom-32" />
        </Conversation>
      </div>
    </div>
  )
}
