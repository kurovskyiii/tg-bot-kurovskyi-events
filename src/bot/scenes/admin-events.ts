import { InlineKeyboard, Keyboard } from 'grammy'
import { Scene } from 'grammy-scenes'

import { checkCallbackActionExists, sendUnavailableActionMessage } from '@root/bot/helpers/actions.js'
import { ADMIN_WELCOME_SCENE_ID } from '@root/bot/scenes/admin-welcome.js'
import { db } from '@root/bot/db/db.js'
import { SubscriptionTypes } from '@root/bot/common/constants.js'

import type { Context } from '@root/bot/common/context.js'

export const ADMIN_EVENTS_SCENE_ID = 'adminEvents'

interface SceneSession {
  description?: string
}

export const adminEventsScene = new Scene<Context, SceneSession>(ADMIN_EVENTS_SCENE_ID)

// Step 1

function generateMenuActions(ctx: Context) {
  return {
    addEvent: ctx.t('admin-events-intro-menu-add-event-action-title'),
    back: ctx.t('back-menu-action-title'),
  }
}

const START_LABEL = 'start'

adminEventsScene.label(START_LABEL).step(async (ctx) => {
  const actions = generateMenuActions(ctx)

  ctx.scene.session = {}

  ctx.reply(
    ctx.t('admin-events-intro-message'),
    {
      reply_markup: new Keyboard()
        .text(actions.addEvent).row()
        .text(actions.back)
        .placeholder(ctx.t('menu-placeholder'))
        .persistent().resized().oneTime(),
      disable_notification: true,
    },
  )
})

// Step 2

const MENU_LABEL = 'menu'

adminEventsScene.wait(MENU_LABEL).on('message:text', async (ctx) => {
  const actions = generateMenuActions(ctx)
  const choice = ctx.message.text

  if (!checkCallbackActionExists({
    actions: Object.values(actions),
    choice,
  })) {
    await sendUnavailableActionMessage({ context: ctx })
    return
  }

  if (choice === actions.addEvent) {
    ctx.scene.resume()
    return
  }

  ctx.scenes.enter(ADMIN_WELCOME_SCENE_ID)
})

function generateNewEventMenuActions(ctx: Context) {
  return {
    back: ctx.t('back-menu-action-title'),
  }
}

// Step 3

const ADD_EVENT_LABEL = 'addEvent'

adminEventsScene.label(ADD_EVENT_LABEL).step(async (ctx) => {
  const actions = generateNewEventMenuActions(ctx)

  ctx.reply(
    ctx.t('admin-events-add-message'),
    {
      reply_markup: new Keyboard()
        .text(actions.back)
        .placeholder(ctx.t('menu-placeholder'))
        .persistent().resized().oneTime(),
      disable_notification: true,
    },
  )
})

// Step 4

function generateVerifyEventMenuActions(ctx: Context) {
  return {
    saveEvent: ctx.t('save-menu-action-title'),
    back: ctx.t('back-menu-action-title'),
  }
}

const ADD_EVENT_MENU_LABEL = 'addEventMenu'

adminEventsScene.wait(ADD_EVENT_MENU_LABEL).on('message:text', async (ctx) => {
  const actions = generateVerifyEventMenuActions(ctx)
  const choice = ctx.message.text

  if (!checkCallbackActionExists({
    actions: Object.values(actions),
    choice,
  })) {
    ctx.scene.session.description = choice
    ctx.reply(
      ctx.t('admin-events-verify-message', { description: choice }),
      {
        reply_markup: new Keyboard()
          .text(actions.saveEvent).row()
          .text(actions.back)
          .placeholder(ctx.t('menu-placeholder'))
          .persistent().resized().oneTime(),
        disable_notification: true,
      },
    )
    ctx.scene.resume()
    return
  }

  ctx.scene.goto(START_LABEL)
})

// Step 5

const VERIFY_EVENT_MENU_LABEL = 'verifyEventMenu'

adminEventsScene.wait(VERIFY_EVENT_MENU_LABEL).on('message:text', async (ctx) => {
  const actions = generateVerifyEventMenuActions(ctx)
  const choice = ctx.message.text

  if (!checkCallbackActionExists({
    actions: Object.values(actions),
    choice,
  })) {
    await sendUnavailableActionMessage({ context: ctx })
    return
  }

  if (choice === actions.saveEvent) {
    const description = ctx.scene.session.description!

    const eventId = await db.addNewEvent({ description })

    const subscriberIds = await db.getNotificationSubscriberIds({ subscriptionType: SubscriptionTypes.EVENTS })

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    for (const userId of subscriberIds) {
      try {
        await ctx.api.sendMessage(userId, ctx.t('events-new-event-message', { description }), {
          reply_markup: new InlineKeyboard().text(ctx.t('events-accept-menu-accept-action-title'), `accept-event-${eventId}`),
        })
        await delay(1000)
      }
      catch {
      }
    }

    await ctx.reply(
      `${ctx.t('admin-events-added-message')}`,
      {
        disable_notification: true,
      },
    )

    ctx.scenes.enter(ADMIN_WELCOME_SCENE_ID)
    return
  }

  ctx.scene.goto(ADD_EVENT_LABEL)
})
