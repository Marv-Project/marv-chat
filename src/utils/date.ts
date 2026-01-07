import { isAfter, isToday, isYesterday, startOfDay, subDays } from 'date-fns'

export type ChatTimePeriod =
  | 'Today'
  | 'Yesterday'
  | 'Last 7 Days'
  | 'Last 30 Days'
  | 'Older'

export function getChatTimePeriod(date: Date | string): ChatTimePeriod {
  const chatDate = typeof date === 'string' ? new Date(date) : date
  const now = new Date()

  if (isToday(chatDate)) return 'Today'
  if (isYesterday(chatDate)) return 'Yesterday'

  const sevenDaysAgo = startOfDay(subDays(now, 7))
  if (isAfter(chatDate, sevenDaysAgo)) return 'Last 7 Days'

  const thirtyDaysAgo = startOfDay(subDays(now, 30))
  if (isAfter(chatDate, thirtyDaysAgo)) return 'Last 30 Days'

  return 'Older'
}

export const TIME_PERIODS_ORDER: ReadonlyArray<ChatTimePeriod> = [
  'Today',
  'Yesterday',
  'Last 7 Days',
  'Last 30 Days',
  'Older',
] as const
