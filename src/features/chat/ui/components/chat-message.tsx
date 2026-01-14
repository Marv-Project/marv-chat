import { CopyIcon, RefreshCcwIcon } from 'lucide-react'
import { useCopyToClipboard } from 'usehooks-ts'
import { toast } from 'sonner'
import type { UseChatHelpers } from '@ai-sdk/react'
import type { AppUIMessage } from '@/lib/ai-sdk/types'
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message'
import { cn } from '@/lib/utils'
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/components/ai-elements/reasoning'

interface MessageProps {
  chatId: string
  message: AppUIMessage
  isLoading: boolean
  regenerate: UseChatHelpers<AppUIMessage>['regenerate']
}

export const PreviewMessage = ({
  chatId,
  message,
  isLoading,
  regenerate,
}: MessageProps) => {
  return (
    <>
      <Message
        key={`${message.id}`}
        from={message.role}
        className={cn(message.role === 'assistant' && 'w-full max-w-full')}
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
                    isStreaming={isLoading}
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

        <ChatMessageAction
          chatId={chatId}
          message={message}
          isLoading={isLoading}
          regenerate={regenerate}
        />
      </Message>
    </>
  )
}

interface ChatMessageActionProps {
  chatId: string
  message: AppUIMessage
  isLoading: boolean
  regenerate: UseChatHelpers<AppUIMessage>['regenerate']
}

const ChatMessageAction = ({
  message,
  isLoading,
  regenerate,
}: ChatMessageActionProps) => {
  const [, copyToClipboard] = useCopyToClipboard()

  if (isLoading) {
    return null
  }

  const textFromParts = message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('\n')
    .trim()

  const handleCopy = async () => {
    if (!textFromParts) {
      toast.error("There's no text to copy!")
      return
    }

    await copyToClipboard(textFromParts)
    toast.success('Copied to clipboard!')
  }

  if (message.role === 'user') {
    return (
      <MessageActions className="justify-end">
        <MessageAction onClick={handleCopy} label="Copy">
          <CopyIcon className="size-3" />
        </MessageAction>
      </MessageActions>
    )
  }

  return (
    <MessageActions>
      <MessageAction onClick={handleCopy} label="Copy">
        <CopyIcon className="size-3" />
      </MessageAction>
      <MessageAction onClick={() => regenerate()} label="Retry">
        <RefreshCcwIcon className="size-3" />
      </MessageAction>
    </MessageActions>
  )
}
