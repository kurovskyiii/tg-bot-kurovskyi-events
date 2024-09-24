import type { SubscriptionTypes } from '@root/bot/common/constants.js'
import type { ID } from '@root/bot/common/values/id.js'
import type { Timestamp } from '@root/bot/common/values/timestamp.js'

export interface Subscription extends Timestamp {
  userId: ID
  type: SubscriptionTypes
}
