import { useSuspenseQuery } from '@tanstack/react-query'
import { orpc } from '@/orpc/client'

export const useThreads = () => {
  return useSuspenseQuery(orpc.threads.getMany.queryOptions())
}
