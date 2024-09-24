import type { ID } from '@root/bot/common/values/id.js'
import type { Timestamp } from '@root/bot/common/values/timestamp.js'

export interface EventAgreement extends Timestamp {
  userId: ID
  eventId: ID
}
