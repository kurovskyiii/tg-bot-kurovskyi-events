import type { ID } from '@root/bot/common/values/id.js'
import type { Timestamp } from '@root/bot/common/values/timestamp.js'

export interface Event extends Timestamp {
  id: ID
  description: string
}
