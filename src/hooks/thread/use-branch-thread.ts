import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { orpc } from '@/orpc/client'

export const useBranchThread = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation(
    orpc.threads.branch.mutationOptions({
      onSuccess: (data) => {
        void queryClient.invalidateQueries(orpc.threads.getMany.queryOptions())

        toast.success('Thread branched successfully')

        void navigate({
          to: '/chat/$chatId',
          params: { chatId: data.id },
          search: { autoGenerate: true },
        })
      },

      onError: (error) => {
        toast.error('Failed to branch thread', {
          description: error.message,
        })
      },
    }),
  )
}
