import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { orpc } from '@/orpc/client'

export const useTogglePinChat = () => {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.chats.togglePin.mutationOptions({
      onSuccess: (data) => {
        void queryClient.invalidateQueries(orpc.chats.getAll.queryOptions())

        toast.success(data.pinned ? 'Chat pinned' : 'Chat unpinned')
      },

      onError: (error) => {
        toast.error('Failed to update pin status', {
          description: error.message,
        })
      },
    }),
  )
}
