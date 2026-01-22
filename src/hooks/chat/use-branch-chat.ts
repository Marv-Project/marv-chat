import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { orpc } from '@/orpc/client'

export const useBranchChat = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation(
    orpc.chats.branch.mutationOptions({
      onSuccess: (data) => {
        void queryClient.invalidateQueries(orpc.chats.getAll.queryOptions())

        toast.success('Chat branched successfully')

        void navigate({
          to: '/chat/$chatId',
          params: { chatId: data.id },
          search: { autoGenerate: true },
        })
      },

      onError: (error) => {
        toast.error('Failed to branch chat', {
          description: error.message,
        })
      },
    }),
  )
}
