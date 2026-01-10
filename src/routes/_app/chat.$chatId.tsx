import { createFileRoute, useLocation } from '@tanstack/react-router'
import { useCallback } from 'react'
import { ChatInterface } from '@/features/chat/ui/components/chat-interface'
import { useMessages } from '@/hooks/messsage/use-messages'

export const Route = createFileRoute('/_app/chat/$chatId')({
  component: RouteComponent,
  loader: ({ context: { orpc, queryClient }, params }) => {
    return queryClient.ensureQueryData(
      orpc.messages.getAll.queryOptions({ input: { chatId: params.chatId } }),
    )
  },
})

function RouteComponent() {
  const params = Route.useParams()
  const location = useLocation()
  const { data: initialMessages } = useMessages(params.chatId)

  // Clear initial prompt after it's sent to prevent re-sending on refresh
  const handleInitialPromptSent = useCallback(() => {
    // Clear the navigation state to prevent re-sending on browser back/forward
    window.history.replaceState(null, '', window.location.pathname)
  }, [])

  return (
    <ChatInterface
      chatId={params.chatId}
      initialMessages={initialMessages}
      initialPrompt={location.state.initialPrompt}
      onInitialPromptSent={handleInitialPromptSent}
    />
  )
}
