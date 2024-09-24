import { Keyboard } from 'grammy'
import { Scene } from 'grammy-scenes'

import { checkCallbackActionExists, sendUnavailableActionMessage } from '@root/bot/helpers/actions.js'
import { ADMIN_EVENTS_SCENE_ID } from '@root/bot/scenes/admin-events.js'
import { ADMIN_BROADCAST_SCENE_ID } from '@root/bot/scenes/admin-broadcast.js'

import type { Context } from '@root/bot/common/context.js'

export const ADMIN_WELCOME_SCENE_ID = 'adminWelcome'

interface SceneSession {
}

export const adminWelcomeScene = new Scene<Context, SceneSession>(ADMIN_WELCOME_SCENE_ID)

// Step 1

function generateMenuActions(ctx: Context) {
  return {
    eventsScene: ctx.t('admin-welcome-intro-menu-events-action-title'),
    broadcastScene: ctx.t('admin-welcome-intro-menu-broadcast-action-title'),
  }
}

const START_LABEL = 'start'

adminWelcomeScene.label(START_LABEL).step(async (ctx) => {
  const actions = generateMenuActions(ctx)

  ctx.reply(
    ctx.t('admin-welcome-intro-message'),
    {
      reply_markup: new Keyboard()
        .text(actions.eventsScene).row()
        .text(actions.broadcastScene)
        .placeholder(ctx.t('menu-placeholder'))
        .persistent().resized().oneTime(),
      disable_notification: true,
    },
  )
})

// Step 2

const MENU_LABEL = 'menu'

adminWelcomeScene.wait(MENU_LABEL).on('message:text', async (ctx) => {
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
    ctx.scenes.enter(ADMIN_EVENTS_SCENE_ID)
  }
  else if (choice === actions.broadcastScene) {
    ctx.scenes.enter(ADMIN_BROADCAST_SCENE_ID)
  }
})
