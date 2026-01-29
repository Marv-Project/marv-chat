import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { orpc } from '@/orpc/client'

export const useRenameChat = () => {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.chats.rename.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries(orpc.chats.getAll.queryOptions())

        toast.success('Chat renamed successfully')
      },

      onError: (error) => {
        toast.error('Failed to rename chat', {
          description: error.message,
        })
      },
    }),
  )
}
