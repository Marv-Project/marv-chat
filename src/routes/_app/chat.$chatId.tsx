import { createFileRoute } from '@tanstack/react-router'
import { useMessages } from '@/hooks/messsage/use-messages'
import { ChatInterface } from '@/features/chat/ui/components/chat-interface'

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
  const { data: initialMessages } = useMessages(params.chatId)

  return (
    <ChatInterface chatId={params.chatId} initialMessages={initialMessages} />
  )
}
