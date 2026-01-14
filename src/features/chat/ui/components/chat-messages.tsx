import type { UseChatHelpers } from '@ai-sdk/react'
import type { AppUIMessage } from '@/lib/ai-sdk/types'
import { PreviewMessage } from '@/features/chat/ui/components/chat-message'

interface MessagesProps {
  chatId: string
  messages: AppUIMessage[]
  status: UseChatHelpers<AppUIMessage>['status']
  regenerate: UseChatHelpers<AppUIMessage>['regenerate']
}

export const Messages = ({
  chatId,
  messages,
  status,
  regenerate,
}: MessagesProps) => {
  return (
    <div
      className="absolute inset-0 overflow-y-scroll pt-8 sm:pt-3.5"
      style={{
        paddingBottom: '144px',
        scrollbarGutter: 'stable both-edges',
        scrollPaddingBottom: '97px',
      }}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col space-y-12 px-4 pb-10">
        {messages.map((message, index) => (
          <PreviewMessage
            key={message.id}
            chatId={chatId}
            message={message}
            isLoading={status === 'streaming' && messages.length - 1 === index}
            regenerate={regenerate}
          />
        ))}
      </div>
    </div>
  )
}
