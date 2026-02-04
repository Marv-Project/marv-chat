import type { UserTypeEnum } from '@/lib/db/schemas'

type Entitlements = {
  maxMessagesPerDay: number
}

export const entitlementsByUserType: Record<UserTypeEnum, Entitlements> = {
  /*
   * For users without an account
   */
  guest: {
    maxMessagesPerDay: 20,
  },

  /*
   * For users with an account
   */
  registered: {
    maxMessagesPerDay: 50,
  },

  /*
   * TODO: For users with an account and a paid membership
   */
}
