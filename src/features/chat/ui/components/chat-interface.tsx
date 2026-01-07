import { useEffect, useRef, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Streamdown } from 'streamdown'
import { Send } from 'lucide-react'
import type { AppUIMessage } from '@/lib/ai-sdk/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ChatLayoutProps {
  id: string
  initialMessages?: AppUIMessage[]
}

export const ChatInterface = ({ id, initialMessages }: ChatLayoutProps) => {
  const [input, setInput] = useState('')
  const { messages, sendMessage, status } = useChat({
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

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    void sendMessage({ text })
    setInput('')
  }

  return (
    <div className="mx-auto grid w-full grid-rows-[1fr_auto] overflow-hidden p-4">
      <div className="space-y-4 overflow-y-auto pb-4">
        {messages.length === 0 ? (
          <div className="text-muted-foreground mt-8 text-center">
            Ask me anything to get started!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-primary/10 ml-8'
                  : 'bg-secondary/20 mr-8'
              }`}
            >
              <p className="mb-1 text-sm font-semibold">
                {message.role === 'user' ? 'You' : 'AI Assistant'}
              </p>
              {message.parts.map((part, index) => {
                if (part.type === 'text') {
                  return (
                    <Streamdown
                      key={index}
                      isAnimating={
                        status === 'streaming' && message.role === 'assistant'
                      }
                    >
                      {part.text}
                    </Streamdown>
                  )
                }
                return null
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex w-full items-center space-x-2 border-t pt-2"
      >
        <Input
          name="prompt"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          autoComplete="off"
          autoFocus
        />
        <Button type="submit" size="icon">
          <Send size={18} />
        </Button>
      </form>
    </div>
  )
}
