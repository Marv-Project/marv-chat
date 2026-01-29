import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input'
import { InputGroupButton } from '@/components/ui/input-group'
import type { AppUIMessage } from '@/lib/ai-sdk/types'
import type { UseChatHelpers } from '@ai-sdk/react'
import { useNavigate } from '@tanstack/react-router'
import { LoaderIcon, SparklesIcon, StopCircleIcon } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useLocalStorage } from 'usehooks-ts'
import { ChatModelSelector } from './chat-model-selector'

interface MultiModalInputProps {
  chatId: string
  input: string
  setInput: Dispatch<SetStateAction<string>>
  status: UseChatHelpers<AppUIMessage>['status']
  stop: () => void
  messages: AppUIMessage[]
  sendMessage: UseChatHelpers<AppUIMessage>['sendMessage']
}

export const MultiModalInput = ({
  chatId,
  input,
  setInput,
  status,
  stop,
  sendMessage,
}: MultiModalInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const hasHydratedRef = useRef(false)
  const [localStorageInput, setLocalStorageInput] = useLocalStorage('input', '')
  const [isEnhancing, setIsEnhancing] = useState(false)
  const navigate = useNavigate()

  const handleEnhancePrompt = async () => {
    if (!input.trim() || isEnhancing) return

    setIsEnhancing(true)
    try {
      const response = await fetch('/api/ai/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      })

      if (!response.ok) {
        throw new Error('Failed to enhance prompt')
      }

      const { enhanced } = await response.json()
      setInput(enhanced)
      toast.success('Prompt enhanced!')
    } catch {
      toast.error('Failed to enhance prompt')
    } finally {
      setIsEnhancing(false)
    }
  }

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value)
  }

  const submitForm = useCallback(() => {
    const isOnHomepage = window.location.pathname === '/'

    if (isOnHomepage) {
      // Navigate first, then the chat page will handle streaming via query param
      void navigate({
        to: '/chat/$chatId',
        params: { chatId },
        search: { query: input },
        viewTransition: true,
      })
    } else {
      // Already on chat page, just send the message
      void sendMessage({
        role: 'user',
        parts: [{ type: 'text', text: input }],
      })
    }

    setLocalStorageInput('')
    setInput('')
  }, [input, setInput, sendMessage, setLocalStorageInput, navigate, chatId])

  useEffect(() => {
    if (hasHydratedRef.current) return
    hasHydratedRef.current = true

    if (textareaRef.current) {
      const domValue = textareaRef.current.value
      // Prefer DOM value over localStorage to handle hydration
      const finalValue = domValue || localStorageInput || ''
      setInput(finalValue)
    }
  }, [localStorageInput, setInput])

  useEffect(() => {
    setLocalStorageInput(input)
  }, [input, setLocalStorageInput])

  return (
    <div className="w-full">
      <PromptInput
        className="bg-sidebar/65! supports-backdrop-filter:bg-sidebar/65! ring-sidebar-border/75 rounded-lg ring-4 backdrop-blur-sm"
        onSubmit={() => {
          if (status !== 'ready') {
            toast.error('Please wait for the model to finish its response!')
          } else {
            submitForm()
          }
        }}
        globalDrop
        multiple
      >
        <PromptInputBody>
          <PromptInputTextarea
            onChange={handleInput}
            value={input}
            ref={textareaRef}
          />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools>
            <ChatModelSelector />

            <PromptInputButton
              onClick={handleEnhancePrompt}
              disabled={!input.trim() || isEnhancing}
            >
              {isEnhancing ? (
                <LoaderIcon size={16} className="animate-spin" />
              ) : (
                <SparklesIcon size={16} />
              )}
              <span>{isEnhancing ? 'Enhancing...' : 'Enhance'}</span>
            </PromptInputButton>
          </PromptInputTools>

          {status === 'streaming' ? (
            <StopButton stop={stop} />
          ) : (
            <PromptInputSubmit
              disabled={!input || status === 'submitted' || !input.trim()}
              status={status}
            />
          )}
        </PromptInputFooter>
      </PromptInput>
    </div>
  )
}

const StopButton = ({ stop }: { stop: () => void }) => {
  return (
    <InputGroupButton
      variant="default"
      size="icon-sm"
      data-testid="stop-button"
      onClick={(event) => {
        event.preventDefault()
        stop()
      }}
    >
      <StopCircleIcon />
    </InputGroupButton>
  )
}
