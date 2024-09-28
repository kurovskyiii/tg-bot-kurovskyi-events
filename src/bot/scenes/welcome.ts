import { Keyboard } from 'grammy'
import { Scene } from 'grammy-scenes'

import { checkCallbackActionExists, sendUnavailableActionMessage } from '@root/bot/helpers/actions.js'
import { EVENTS_SCENE_ID } from '@root/bot/scenes/events.js'
import { QUESTIONS_SCENE_ID } from '@root/bot/scenes/questions.js'

import type { Context } from '@root/bot/common/context.js'

export const WELCOME_SCENE_ID = 'welcome'

interface SceneSession {
}

export const welcomeScene = new Scene<Context, SceneSession>(WELCOME_SCENE_ID)

// Step 1

function generateMenuActions(ctx: Context) {
  return {
    eventsScene: ctx.t('welcome-intro-menu-events-action-title'),
    questionsScene: ctx.t('welcome-intro-menu-questions-action-title'),
  }
}

const START_LABEL = 'start'

welcomeScene.label(START_LABEL).step(async (ctx) => {
  const actions = generateMenuActions(ctx)

  ctx.reply(
    ctx.t('welcome-intro-message'),
    {
      reply_markup: new Keyboard()
        .text(actions.questionsScene).row()
        .text(actions.eventsScene)
        .placeholder(ctx.t('menu-placeholder'))
        .persistent().resized().oneTime(),
      disable_notification: true,
    },
  )
})

// Step 2

const MENU_LABEL = 'menu'

welcomeScene.wait(MENU_LABEL).on('message:text', async (ctx) => {
  const actions = generateMenuActions(ctx)
  const choice = ctx.message.text

  if (!checkCallbackActionExists({
    actions: Object.values(actions),
    choice,
  })) {
    await sendUnavailableActionMessage({ context: ctx })
    return
  }

  if (choice === actions.eventsScene) {
    ctx.scenes.enter(EVENTS_SCENE_ID)
  }

  if (choice === actions.questionsScene) {
    ctx.scenes.enter(QUESTIONS_SCENE_ID)
  }
})
