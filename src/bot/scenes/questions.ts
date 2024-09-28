import { InlineKeyboard, Keyboard } from 'grammy'
import { Scene } from 'grammy-scenes'

import { checkCallbackActionExists, sendUnavailableActionMessage } from '@root/bot/helpers/actions.js'
import { WELCOME_SCENE_ID } from '@root/bot/scenes/index.js'
import { db } from '@root/bot/db/db.js'

import type { Context } from '@root/bot/common/context.js'
import { config } from '@root/config.js'

export const QUESTIONS_SCENE_ID = 'questions'

interface SceneSession {
  description?: string
}

export const questionsScene = new Scene<Context, SceneSession>(QUESTIONS_SCENE_ID)

// Step 1

function generateMenuActions(ctx: Context) {
  return {
    addQuestion: ctx.t('questions-intro-menu-add-question-action-title'),
    back: ctx.t('back-menu-action-title'),
  }
}

const START_LABEL = 'start'

questionsScene.label(START_LABEL).step(async (ctx) => {
  const actions = generateMenuActions(ctx)

  ctx.scene.session = {}

  ctx.reply(
    ctx.t('questions-intro-message'),
    {
      reply_markup: new Keyboard()
        .text(actions.addQuestion).row()
        .text(actions.back)
        .placeholder(ctx.t('menu-placeholder'))
        .persistent().resized().oneTime(),
      disable_notification: true,
    },
  )
})

// Step 2

const MENU_LABEL = 'menu'

questionsScene.wait(MENU_LABEL).on('message:text', async (ctx) => {
  const actions = generateMenuActions(ctx)
  const choice = ctx.message.text

  if (!checkCallbackActionExists({
    actions: Object.values(actions),
    choice,
  })) {
    await sendUnavailableActionMessage({ context: ctx })
    return
  }

  if (choice === actions.addQuestion) {
    ctx.scene.resume()
    return
  }

  ctx.scenes.enter(WELCOME_SCENE_ID)
})

function generateNewQuestionMenuActions(ctx: Context) {
  return {
    back: ctx.t('back-menu-action-title'),
  }
}

// Step 3

const ADD_QUESTION_LABEL = 'addQuestion'

questionsScene.label(ADD_QUESTION_LABEL).step(async (ctx) => {
  const actions = generateNewQuestionMenuActions(ctx)

  ctx.reply(
    ctx.t('questions-add-message'),
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

function generateVerifyQuestionMenuActions(ctx: Context) {
  return {
    saveQuestion: ctx.t('save-menu-action-title'),
    back: ctx.t('back-menu-action-title'),
  }
}

const ADD_QUESTION_MENU_LABEL = 'addQuestionMenu'

questionsScene.wait(ADD_QUESTION_MENU_LABEL).on('message:text', async (ctx) => {
  const actions = generateVerifyQuestionMenuActions(ctx)
  const choice = ctx.message.text

  if (!checkCallbackActionExists({
    actions: Object.values(actions),
    choice,
  })) {
    ctx.scene.session.description = choice
    ctx.reply(
      ctx.t('questions-verify-message', { description: choice }),
      {
        reply_markup: new Keyboard()
          .text(actions.saveQuestion).row()
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

const VERIFY_QUESTION_MENU_LABEL = 'verifyQuestionMenu'

questionsScene.wait(VERIFY_QUESTION_MENU_LABEL).on('message:text', async (ctx) => {
  const actions = generateVerifyQuestionMenuActions(ctx)
  const choice = ctx.message.text

  if (!checkCallbackActionExists({
    actions: Object.values(actions),
    choice,
  })) {
    await sendUnavailableActionMessage({ context: ctx })
    return
  }

  if (choice === actions.saveQuestion) {
    const description = ctx.scene.session.description!

    const questionId = await db.addNewQuestion({ description, userId: ctx.from.id })

    const botAdminIds = config.botAdmins

    try {
      await ctx.broadcastMessage(botAdminIds, ctx.t('admin-user-sent-new-question', {
        username: ctx.from.username ?? '–',
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name ?? '–',
        description,
      }), {
        reply_markup: new InlineKeyboard().text(ctx.t('questions-income-menu-give-answer-title'), `questions-give-answer-${questionId}`),
      })
    }
    catch {}

    await ctx.reply(
      `${ctx.t('questions-added-message')}`,
      {
        disable_notification: true,
      },
    )

    ctx.scenes.enter(WELCOME_SCENE_ID)
    return
  }

  ctx.scene.goto(ADD_QUESTION_LABEL)
})
