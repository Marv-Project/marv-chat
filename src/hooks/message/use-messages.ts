import { useSuspenseQuery } from '@tanstack/react-query'
import type { AppUIMessage } from '@/lib/ai-sdk/types'
import { orpc } from '@/orpc/client'

export const useMessages = (threadId: string) => {
  const messages = useSuspenseQuery(
    orpc.messages.getMany.queryOptions({ input: { threadId } }),
  )

  const data = messages.data.map((m) => ({
    id: m.id,
    role: m.role,
    parts: m.parts,
    metadata: m.metadata,
  })) as AppUIMessage[]

  return {
    ...messages,
    data,
  }
}
