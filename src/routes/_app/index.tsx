import { createFileRoute, useRouter } from '@tanstack/react-router'
import { v4 as uuidV4 } from 'uuid'
import type { PromptInputMessage } from '@/components/ai-elements/prompt-input'
import { ChatInterface } from '@/features/chat/ui/components/chat-interface'

export const Route = createFileRoute('/_app/')({ component: App })

function App() {
  const { navigate } = useRouter()

  const handleFirstPrompt = (message: PromptInputMessage) => {
    if (!message.text.trim()) return

    const chatId = uuidV4()

    void navigate({
      to: '/chat/$chatId',
      params: { chatId },
      state: { initialPrompt: message },
      viewTransition: true,
    })
  }

  return (
    <ChatInterface
      chatId={undefined}
      initialMessages={[]}
      onFirstPrompt={handleFirstPrompt}
    />
  )
}
