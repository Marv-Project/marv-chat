import { useMemo } from 'react'
import type { RouterOutputs } from '@/orpc/routers'
import type { ChatTimePeriod } from '@/utils/date'
import { TIME_PERIODS_ORDER, getChatTimePeriod } from '@/utils/date'

type Thread = RouterOutputs['threads']['getMany'][number]
export type GroupedThreads = Record<ChatTimePeriod, Thread[]>

interface UseGroupedThreadsReturn {
  groupedThreads: GroupedThreads
  periodsWithThreads: ChatTimePeriod[]
}

export function useGroupedThreads(threads: Thread[]): UseGroupedThreadsReturn {
  return useMemo(() => {
    // Initialize empty groups
    const grouped: GroupedThreads = {
      Today: [],
      Yesterday: [],
      'Last 7 Days': [],
      'Last 30 Days': [],
      Older: [],
    }

    // Group threads by time period based on updatedAt
    for (const thread of threads) {
      const period = getChatTimePeriod(thread.updatedAt)
      grouped[period].push(thread)
    }

    // Sort within each group by updatedAt (most recent first)
    for (const period of TIME_PERIODS_ORDER) {
      grouped[period].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
    }

    // Filter to only periods that have threads
    const periodsWithThreads = TIME_PERIODS_ORDER.filter(
      (period) => grouped[period].length > 0,
    )

    return { groupedThreads: grouped, periodsWithThreads }
  }, [threads])
}
