import { InlineKeyboard } from 'grammy'
import { Scene } from 'grammy-scenes'

import { checkCallbackActionExists, sendUnavailableActionMessage } from '@root/bot/helpers/actions.js'
import { EVENTS_SCENE_ID } from '@root/bot/scenes/events.js'

import type { Context } from '@root/bot/context.js'

const SCENE_ID = 'welcome'

enum MainMenuActions {
  EVENTS_SCENE = 'eventsScene',
}

interface SceneSession {
}

const scene = new Scene<Context, SceneSession>(SCENE_ID)

scene.label('start').step(async (ctx) => {
  ctx.reply(ctx.t('welcome-intro-message'), { reply_markup: new InlineKeyboard().text(ctx.t('welcome-intro-menu-events-action-title'), MainMenuActions.EVENTS_SCENE), disable_notification: true })
})

scene.wait('menu').on('callback_query:data', async (ctx) => {
  await ctx.editMessageReplyMarkup({ reply_markup: { inline_keyboard: [] } })
  await ctx.answerCallbackQuery()

  const choice = ctx.callbackQuery.data

  if (!checkCallbackActionExists({ actions: [MainMenuActions.EVENTS_SCENE], context: ctx })) {
    await sendUnavailableActionMessage({ context: ctx })
    ctx.scene.goto('start')
    return
  }

  if (choice === MainMenuActions.EVENTS_SCENE) {
    ctx.scenes.enter(EVENTS_SCENE_ID)
  }
})

export { scene as welcomeScene, SCENE_ID as WELCOME_SCENE_ID }
