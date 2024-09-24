import { Composer } from 'grammy'

import { logHandle } from '@root/bot/helpers/logging.js'
import type { Context } from '@root/bot/common/context.js'

export const unhandledFeature = new Composer<Context>()

const filteredUnhandledFeature = unhandledFeature.chatType('private')

filteredUnhandledFeature.on('message', logHandle('unhandled-message'), (ctx) => {
  return ctx.reply(ctx.t('error-unhandled'))
})

filteredUnhandledFeature.on('callback_query', logHandle('unhandled-callback-query'), (ctx) => {
  return ctx.answerCallbackQuery()
})
