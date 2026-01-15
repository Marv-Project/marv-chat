import { useStickToBottom } from 'use-stick-to-bottom'
import { ChevronDownIcon } from 'lucide-react'
import { Fragment } from 'react/jsx-runtime'
import type { UseChatHelpers } from '@ai-sdk/react'
import type { AppUIMessage } from '@/lib/ai-sdk/types'
import { PreviewMessage } from '@/features/chat/ui/components/chat-message'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from '@/components/ai-elements/sources'

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
  const { scrollRef, contentRef, isAtBottom, scrollToBottom } =
    useStickToBottom({
      initial: 'smooth',
      resize: 'smooth',
    })

  return (
    <>
      <div
        ref={scrollRef}
        className="absolute inset-0 overflow-y-auto pt-8 sm:pt-3.5"
        style={{
          paddingBottom: '144px',
          scrollbarGutter: 'stable both-edges',
          scrollPaddingBottom: '97px',
        }}
      >
        <div ref={contentRef}>
          <div className="mx-auto flex w-full max-w-3xl flex-col space-y-12 px-4 pb-10">
            {messages.map((message, index) => (
              <Fragment key={message.id}>
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
                      {message.parts.map((part, i) => {
                        switch (part.type) {
                          case 'source-url':
                            return (
                              <SourcesContent key={`${message.id}-${i}`}>
                                <Source
                                  key={`${message.id}-${i}`}
                                  href={part.url}
                                  title={part.url}
                                />
                              </SourcesContent>
                            )
                        }
                      })}
                    </Sources>
                  )}

                <PreviewMessage
                  chatId={chatId}
                  message={message}
                  isLoading={
                    status === 'streaming' && messages.length - 1 === index
                  }
                  regenerate={regenerate}
                />
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      <ScrollToBottomButton
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />
    </>
  )
}

function ScrollToBottomButton({
  isAtBottom,
  scrollToBottom,
}: {
  isAtBottom: boolean
  scrollToBottom: () => void
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        'transition-all duration-500 ease-in-out',
        'bg-background/80 text-muted-foreground absolute bottom-36 left-1/2 z-20 -translate-x-1/2 rounded-full backdrop-blur-sm',
        isAtBottom
          ? 'pointer-events-none translate-y-10 opacity-0'
          : 'translate-y-0 opacity-100',
      )}
      onClick={() => scrollToBottom()}
    >
      <span className="text-xs font-medium">Scroll to bottom</span>
      <ChevronDownIcon className="repeat-infinite size-4 animate-bounce" />
    </Button>
  )
}
