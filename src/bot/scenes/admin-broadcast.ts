import { Keyboard } from 'grammy'
import { Scene } from 'grammy-scenes'

import { checkCallbackActionExists, sendUnavailableActionMessage } from '@root/bot/helpers/actions.js'
import { ADMIN_WELCOME_SCENE_ID } from '@root/bot/scenes/admin-welcome.js'
import { db } from '@root/bot/db/db.js'

import type { Context } from '@root/bot/common/context.js'

export const ADMIN_BROADCAST_SCENE_ID = 'adminBroadcast'

interface SceneSession {
  description?: string
}

export const adminBroadcastScene = new Scene<Context, SceneSession>(ADMIN_BROADCAST_SCENE_ID)

// Step 1

function generateMenuActions(ctx: Context) {
  return {
    addBroadcast: ctx.t('admin-broadcast-intro-menu-broadcast-action-title'),
    back: ctx.t('back-menu-action-title'),
  }
}

const START_LABEL = 'start'

adminBroadcastScene.label(START_LABEL).step(async (ctx) => {
  const actions = generateMenuActions(ctx)

  ctx.scene.session = {}

  ctx.reply(
    ctx.t('admin-broadcast-intro-message'),
    {
      reply_markup: new Keyboard()
        .text(actions.addBroadcast).row()
        .text(actions.back)
        .placeholder(ctx.t('menu-placeholder'))
        .persistent().resized().oneTime(),
      disable_notification: true,
    },
  )
})

// Step 2

const MENU_LABEL = 'menu'

adminBroadcastScene.wait(MENU_LABEL).on('message:text', async (ctx) => {
  const actions = generateMenuActions(ctx)
  const choice = ctx.message.text

  if (!checkCallbackActionExists({
    actions: Object.values(actions),
    choice,
  })) {
    await sendUnavailableActionMessage({ context: ctx })
    return
  }

  if (choice === actions.addBroadcast) {
    ctx.scene.resume()
    return
  }

  ctx.scenes.enter(ADMIN_WELCOME_SCENE_ID)
})

// Step 3

function generateNewBroadcastMenuActions(ctx: Context) {
  return {
    back: ctx.t('back-menu-action-title'),
  }
}

const ADD_BROADCAST_LABEL = 'addBroadcast'

adminBroadcastScene.label(ADD_BROADCAST_LABEL).step(async (ctx) => {
  const actions = generateNewBroadcastMenuActions(ctx)

  ctx.reply(
    ctx.t('admin-broadcast-add-message'),
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

function generateVerifyBroadcastMenuActions(ctx: Context) {
  return {
    saveBroadcast: ctx.t('save-menu-action-title'),
    back: ctx.t('back-menu-action-title'),
  }
}

const ADD_BROADCAST_MENU_LABEL = 'addBroadcastMenu'

adminBroadcastScene.wait(ADD_BROADCAST_MENU_LABEL).on('message:text', async (ctx) => {
  const actions = generateVerifyBroadcastMenuActions(ctx)
  const choice = ctx.message.text

  if (!checkCallbackActionExists({
    actions: Object.values(actions),
    choice,
  })) {
    ctx.scene.session.description = choice
    ctx.reply(
      ctx.t('admin-broadcast-verify-message', { description: choice }),
      {
        reply_markup: new Keyboard()
          .text(actions.saveBroadcast).row()
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

const VERIFY_BROADCAST_MENU_LABEL = 'verifyBroadcastMenu'

adminBroadcastScene.wait(VERIFY_BROADCAST_MENU_LABEL).on('message:text', async (ctx) => {
  const actions = generateVerifyBroadcastMenuActions(ctx)
  const choice = ctx.message.text

  if (!checkCallbackActionExists({
    actions: Object.values(actions),
    choice,
  })) {
    await sendUnavailableActionMessage({ context: ctx })
    return
  }

  if (choice === actions.saveBroadcast) {
    const description = ctx.scene.session.description!

    const allUserIds = await db.getAllUserIds()

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    for (const userId of allUserIds) {
      try {
        await ctx.api.sendMessage(userId, ctx.t('broadcast-new-message', { description }))
        await delay(1000)
      }
      catch {
      }
    }

    await ctx.reply(
      `${ctx.t('admin-broadcast-added-message')}`,
      {
        disable_notification: true,
      },
    )

    ctx.scenes.enter(ADMIN_WELCOME_SCENE_ID)
    return
  }

  ctx.scene.goto(ADD_BROADCAST_LABEL)
})
