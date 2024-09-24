import type { ID } from '@root/bot/common/values/id.js'
import type { Timestamp } from '@root/bot/common/values/timestamp.js'

export interface User extends Timestamp {
  id: ID
  firstName: string
  lastName?: string
  username?: string
  languageCode?: string
}
