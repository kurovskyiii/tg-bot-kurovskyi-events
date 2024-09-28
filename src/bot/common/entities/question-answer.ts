import type { ID } from '@root/bot/common/values/id.js'
import type { Timestamp } from '@root/bot/common/values/timestamp.js'

export interface QuestionAnswer extends Timestamp {
  id: ID
  questionId: ID
  description: string
}
