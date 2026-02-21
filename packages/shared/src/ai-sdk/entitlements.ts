import type { UserTypeEnum } from '@marv-chat/db/schemas/auth'

type Entitlements = {
  maxMessagesPerDay: number
}

export const entitlementsByUserType: Record<UserTypeEnum, Entitlements> = {
  /**
   * For users without an account
   */
  guest: {
    maxMessagesPerDay: 20,
  },

  /**
   * For users with an account
   */
  registered: {
    maxMessagesPerDay: 50,
  },

  /**
   * TODO: For users with an account and paid subscription
   */
}
