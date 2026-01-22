import { useSuspenseQuery } from '@tanstack/react-query'
import type { AppUIMessage } from '@/lib/ai-sdk/types'
import { orpc } from '@/orpc/client'

export const useMessages = (chatId: string) => {
  const messages = useSuspenseQuery(
    orpc.messages.getAll.queryOptions({ input: { chatId } }),
  )

  const data = messages.data.map((m) => ({
    id: m.id,
    role: m.role,
    parts: m.parts,
    metadata: {
      modelId: m.modelId,
      createdAt: m.createdAt,
      totalTokens: m.totalTokens,
    },
  })) as AppUIMessage[]

  return {
    ...messages,
    data,
  }
}
