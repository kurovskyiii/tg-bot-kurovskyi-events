import type { Event } from '@root/bot/common/entities/event.js'
import type { EventAgreement, Subscription } from '@root/bot/common/entities/index.js'
import type { User } from '@root/bot/common/entities/user.js'

export interface Db {
  users: User[]
  subscriptions: Subscription[]
  events: Event[]
  eventAgreements: EventAgreement[]
}
