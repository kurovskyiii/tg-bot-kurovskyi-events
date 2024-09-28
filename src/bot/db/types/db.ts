import type { Event, EventAgreement, Question, QuestionAnswer, Subscription, User } from '@root/bot/common/entities/index.js'

export interface Db {
  users: User[]
  subscriptions: Subscription[]
  events: Event[]
  eventAgreements: EventAgreement[]
  questions: Question[]
  questionAnswers: QuestionAnswer[]
}
