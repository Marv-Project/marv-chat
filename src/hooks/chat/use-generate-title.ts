import { useMutation, useQueryClient } from '@tanstack/react-query'
import { orpc } from '@/orpc/client'

export const useGenerateTitle = () => {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.chats.generateTitle.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries(orpc.chats.getAll.queryOptions())
      },
    }),
  )
}
