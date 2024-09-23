import { InlineKeyboard } from 'grammy'
import { Scene } from 'grammy-scenes'

import { Actions, Subscriptions } from '@root/bot/common/constants.js'
import { checkCallbackActionExists, sendUnavailableActionMessage } from '@root/bot/helpers/actions.js'
import { WELCOME_SCENE_ID } from '@root/bot/scenes/welcome.js'

import type { Context } from '@root/bot/context.js'

const SCENE_ID = 'events'

enum MainMenuActions {
  SUBSCRIBE = 'subscribe',
}

interface SceneSession {
}

const scene = new Scene<Context, SceneSession>(SCENE_ID)

scene.step(async (ctx) => {
  if (ctx.session.subscriptions.includes(Subscriptions.EVENTS)) {
    await ctx.reply(ctx.t('events-already-subscribed-message'), { disable_notification: true })
    ctx.scenes.enter(WELCOME_SCENE_ID)
    return
  }

  ctx.reply(ctx.t('events-intro-message'), { reply_markup: new InlineKeyboard().text(ctx.t('events-intro-menu-subscribe-action-title'), MainMenuActions.SUBSCRIBE).text(ctx.t('events-intro-menu-back-action-title'), Actions.GO_BACK), disable_notification: true })
})

scene.wait('menu').on('callback_query:data', async (ctx) => {
  await ctx.editMessageReplyMarkup({ reply_markup: { inline_keyboard: [] } })
  await ctx.answerCallbackQuery()
  const choice = ctx.callbackQuery.data

  if (!checkCallbackActionExists({ actions: [...Object.values(MainMenuActions), ...Object.values(Actions)], context: ctx })) {
    await sendUnavailableActionMessage({ context: ctx })
    ctx.scene.resume()
    return
  }

  if (choice === MainMenuActions.SUBSCRIBE) {
    ctx.session.subscriptions = [Subscriptions.EVENTS]
    await ctx.reply(ctx.t('events-subscribed-message'), { disable_notification: true })
  }

  ctx.scenes.enter(WELCOME_SCENE_ID)
})

export { scene as eventsScene, SCENE_ID as EVENTS_SCENE_ID }
