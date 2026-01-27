import { createFileRoute } from '@tanstack/react-router'
import { ChatInterface } from '@/features/chat/ui/components/chat-interface'
import { useMessages } from '@/hooks/message/use-messages'
import { chatIdRouterValidator } from '@/schemas/router.schema'

export const Route = createFileRoute('/_app/chat/$chatId')({
  component: RouteComponent,
  validateSearch: chatIdRouterValidator,
  loader: ({ context: { orpc, queryClient }, params }) => {
    return queryClient.ensureQueryData(
      orpc.messages.getAll.queryOptions({ input: { chatId: params.chatId } }),
    )
  },
  pendingComponent: () => <div>Loading in Chat ID...</div>,
})

function RouteComponent() {
  const params = Route.useParams()
  const { data: initialMessages } = useMessages(params.chatId)

  return (
    <ChatInterface
      id={params.chatId}
      initialMessages={initialMessages}
      key={params.chatId}
    />
  )
}
