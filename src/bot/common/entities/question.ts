import type { ID } from '@root/bot/common/values/id.js'
import type { Timestamp } from '@root/bot/common/values/timestamp.js'

export interface Question extends Timestamp {
  id: ID
  userId: ID
  description: string
}
