import { CopyIcon, GitBranchIcon, RefreshCcwIcon } from 'lucide-react'
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
import { useBranchChat } from '@/hooks/chat/use-branch-chat'

interface MessageProps {
  chatId: string
  message: AppUIMessage
  messageIndex: number
  isLoading: boolean
  regenerate: UseChatHelpers<AppUIMessage>['regenerate']
}

// Priority order for part types (lower = first)
const partTypePriority: Record<string, number> = {
  reasoning: 0,
  text: 1,
}

export const PreviewMessage = ({
  chatId,
  message,
  messageIndex,
  isLoading,
  regenerate,
}: MessageProps) => {
  // Sort parts: reasoning first, then text (some models output reasoning last)
  const sortedParts =
    message.role === 'assistant'
      ? [...message.parts].sort(
          (a, b) =>
            (partTypePriority[a.type] ?? 99) - (partTypePriority[b.type] ?? 99),
        )
      : message.parts

  return (
    <>
      <Message
        key={`${message.id}`}
        from={message.role}
        className={cn(message.role === 'assistant' && 'w-full max-w-full')}
      >
        <MessageContent>
          {sortedParts.map((part, i) => {
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
          messageIndex={messageIndex}
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
  messageIndex: number
  isLoading: boolean
  regenerate: UseChatHelpers<AppUIMessage>['regenerate']
}

const ChatMessageAction = ({
  chatId,
  message,
  messageIndex,
  isLoading,
  regenerate,
}: ChatMessageActionProps) => {
  const [, copyToClipboard] = useCopyToClipboard()
  const { mutate: branchChat, isPending: isBranching } = useBranchChat()

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

    const ok = await copyToClipboard(textFromParts)
    if (ok) {
      toast.success('Copied to clipboard!')
    } else {
      toast.error('Failed to copy to clipboard')
    }
  }

  const handleBranch = () => {
    branchChat({ chatId, messageIndex })
  }

  if (message.role === 'user') {
    return (
      <MessageActions className="justify-end">
        <MessageAction onClick={handleCopy} label="Copy">
          <CopyIcon className="size-3" />
        </MessageAction>
        <MessageAction onClick={handleBranch} label="Branch" disabled={isBranching}>
          <GitBranchIcon className="size-3" />
        </MessageAction>
      </MessageActions>
    )
  }

  return (
    <MessageActions>
      <MessageAction onClick={handleCopy} label="Copy">
        <CopyIcon className="size-3" />
      </MessageAction>
      <MessageAction onClick={handleBranch} label="Branch" disabled={isBranching}>
        <GitBranchIcon className="size-3" />
      </MessageAction>
      <MessageAction onClick={() => regenerate()} label="Retry">
        <RefreshCcwIcon className="size-3" />
      </MessageAction>
    </MessageActions>
  )
}
