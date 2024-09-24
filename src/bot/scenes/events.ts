import { Keyboard } from 'grammy'
import { Scene } from 'grammy-scenes'

import { SubscriptionTypes } from '@root/bot/common/constants.js'
import { checkCallbackActionExists, sendUnavailableActionMessage } from '@root/bot/helpers/actions.js'
import { WELCOME_SCENE_ID } from '@root/bot/scenes/welcome.js'
import { db } from '@root/bot/db/db.js'
import { config } from '@root/config.js'

import type { Context } from '@root/bot/common/context.js'

export const EVENTS_SCENE_ID = 'events'

interface SceneSession {
}

export const eventsScene = new Scene<Context, SceneSession>(EVENTS_SCENE_ID)

// Step 1

function generateMenuActions(ctx: Context) {
  return {
    subscribe: ctx.t('events-intro-menu-subscribe-action-title'),
    back: ctx.t('back-menu-action-title'),
  }
}

const START_LABEL = 'start'

eventsScene.label(START_LABEL).step(async (ctx) => {
  if (await db.checkUserAlreadySubscribedToNotifications({ userId: ctx.from?.id ?? 0, subscriptionType: SubscriptionTypes.EVENTS })) {
    await ctx.reply(
      ctx.t('events-already-subscribed-message'),
      {
        disable_notification: true,
      },
    )
    ctx.scenes.enter(WELCOME_SCENE_ID)
    return
  }

  const actions = generateMenuActions(ctx)

  ctx.reply(
    ctx.t('events-intro-message'),
    {
      reply_markup: new Keyboard()
        .text(actions.subscribe).row()
        .text(actions.back)
        .placeholder(ctx.t('menu-placeholder'))
        .persistent().resized().oneTime(),
      disable_notification: true,
    },
  )
})

// Step 2

const MENU_LABEL = 'menu'

eventsScene.wait(MENU_LABEL).on('message:text', async (ctx) => {
  const actions = generateMenuActions(ctx)
  const choice = ctx.message.text

  if (!checkCallbackActionExists({
    actions: Object.values(actions),
    choice,
  })) {
    await sendUnavailableActionMessage({ context: ctx })
    return
  }

  if (choice === actions.subscribe) {
    const userId = ctx.from?.id

    if (!userId) {
      await ctx.reply(ctx.t('error-user-id-not-found'))
      return
    }

    await db.subscribeUserToNotifications({ userId, subscriptionType: SubscriptionTypes.EVENTS })

    const botAdminIds = config.botAdmins
    botAdminIds.forEach(async (adminId) => {
      ctx.api.sendMessage(adminId, ctx.t('admin-user-subscribed-for-notifications-message', {
        username: ctx.from.username ?? '–',
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name ?? '–',
      }))
    })

    await ctx.reply(
      `${ctx.t('events-subscribed-message')}`,
      {
        disable_notification: true,
      },
    )
  }

  ctx.scenes.enter(WELCOME_SCENE_ID)
})
