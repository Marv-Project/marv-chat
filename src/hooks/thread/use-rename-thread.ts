import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { orpc } from '@/orpc/client'

export const useRenameThread = () => {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.threads.rename.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries(orpc.threads.getMany.queryOptions())

        toast.success('Thread renamed successfully')
      },

      onError: (error) => {
        toast.error('Failed to rename thread', {
          description: error.message,
        })
      },
    }),
  )
}
