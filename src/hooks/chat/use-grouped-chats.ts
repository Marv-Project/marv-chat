import { useMemo } from 'react'
import type { RouterOutputs } from '@/orpc/routers'
import type { ChatTimePeriod } from '@/utils/date'
import { TIME_PERIODS_ORDER, getChatTimePeriod } from '@/utils/date'

type Chat = RouterOutputs['chats']['getAll'][number]
export type GroupedChats = Record<ChatTimePeriod, Chat[]>

interface UseGroupedChatsReturn {
  groupedChats: GroupedChats
  periodsWithChats: ChatTimePeriod[]
}

export function useGroupedChats(chats: Chat[]): UseGroupedChatsReturn {
  return useMemo(() => {
    // Initialize empty groups
    const grouped: GroupedChats = {
      Today: [],
      Yesterday: [],
      'Last 7 Days': [],
      'Last 30 Days': [],
      Older: [],
    }

    // Group chats by time period based on updatedAt
    for (const chat of chats) {
      const period = getChatTimePeriod(chat.updatedAt)
      grouped[period].push(chat)
    }

    // Sort within each group by updatedAt (most recent first)
    for (const period of TIME_PERIODS_ORDER) {
      grouped[period].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
    }

    // Filter to only periods that have chats
    const periodsWithChats = TIME_PERIODS_ORDER.filter(
      (period) => grouped[period].length > 0,
    )

    return { groupedChats: grouped, periodsWithChats }
  }, [chats])
}
