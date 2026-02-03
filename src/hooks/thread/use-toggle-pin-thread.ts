import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { orpc } from '@/orpc/client'

export const useTogglePinThread = () => {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.threads.togglePin.mutationOptions({
      onSuccess: (data) => {
        void queryClient.invalidateQueries(orpc.threads.getMany.queryOptions())

        toast.success(data.isPinned ? 'Thread pinned' : 'Thread unpinned')
      },

      onError: (error) => {
        toast.error('Failed to update pin status', {
          description: error.message,
        })
      },
    }),
  )
}
