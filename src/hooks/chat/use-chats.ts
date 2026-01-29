import { useSuspenseQuery } from '@tanstack/react-query'
import { orpc } from '@/orpc/client'

export const useChats = () => {
  return useSuspenseQuery(orpc.chats.getAll.queryOptions())
}
