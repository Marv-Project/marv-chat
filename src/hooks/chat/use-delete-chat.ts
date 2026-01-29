import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { orpc } from '@/orpc/client'

export const useDeleteChat = () => {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.chats.delete.mutationOptions({
      onSuccess: async (chat) => {
        await queryClient.invalidateQueries(orpc.chats.getAll.queryOptions())

        toast.success('Chat deleted', {
          description: `Chat ${chat.title} deleted`,
        })
      },

      onError: (error) => {
        toast.error('Failed to delete chat', {
          description: error.message,
        })
      },
    }),
  )
}
