import { createFileRoute } from '@tanstack/react-router'
import { v4 as uuidv4 } from 'uuid'
import { ChatInterface } from '@/features/chat/ui/components/chat-interface'

export const Route = createFileRoute('/_app/')({
  component: App,
  loader: () => ({ chatId: uuidv4() }),
})

function App() {
  const { chatId } = Route.useLoaderData()

  return <ChatInterface id={chatId} initialMessages={[]} key={chatId} />
}
