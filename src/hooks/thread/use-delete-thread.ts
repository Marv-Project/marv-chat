import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { orpc } from '@/orpc/client'

export const useDeleteThread = () => {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.threads.delete.mutationOptions({
      onSuccess: async (thread) => {
        await queryClient.invalidateQueries(orpc.threads.getMany.queryOptions())

        toast.success('Thread deleted', {
          description: `Thread ${thread.title} deleted`,
        })
      },

      onError: (error) => {
        toast.error('Failed to delete thread', {
          description: error.message,
        })
      },
    }),
  )
}
