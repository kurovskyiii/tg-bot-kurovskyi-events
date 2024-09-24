import { Composer } from 'grammy'

import { logHandle } from '@root/bot/helpers/logging.js'
import { WELCOME_SCENE_ID } from '@root/bot/scenes/welcome.js'
import { isChannelMember } from '@root/bot/guards/index.js'
import { config } from '@root/config.js'
import { db } from '@root/bot/db/db.js'

import type { Context } from '@root/bot/common/context.js'

export const mainFeature = new Composer<Context>()

const filteredMainFeature = mainFeature.chatType('private')

// feature.use(welcomeMainMenu)
filteredMainFeature.command('start', logHandle('command-start'), async (ctx) => {
  if (!(await isChannelMember(ctx))) {
    await ctx.reply(ctx.t('protection-intro-message'), { disable_notification: true })
    return
  }

  const user = {
    id: ctx.from.id,
    username: ctx.from.username,
    firstName: ctx.from.first_name,
    lastName: ctx.from.last_name,
    languageCode: ctx.from.language_code,
  }

  const isNewUser = await db.checkUserExists({ id: user.id })

  await db.registerUser(user)

  await ctx.reply(ctx.t('welcome-initial-message'), { disable_notification: true })

  if (!isNewUser) {
    const botAdminIds = config.botAdmins
    botAdminIds.forEach(async (adminId) => {
      ctx.api.sendMessage(adminId, ctx.t('admin-new-user-message', {
        id: user.id,
        username: user.username ?? '–',
        firstName: user.firstName,
        lastName: user.lastName ?? '–',
        languageCode: user.languageCode ?? '–',
      }))
    })
  }

  return ctx.scenes.enter(WELCOME_SCENE_ID)
})

filteredMainFeature.on('callback_query:data', async (ctx) => {
  const callback = ctx.callbackQuery.data

  if (callback.includes('accept-event-')) {
    ctx.editMessageReplyMarkup(undefined)

    const eventId = callback.split('accept-event-')[1]

    const isUserAlreadyAccepted = await db.checkUserAlreadyAcceptedEvent({ eventId, userId: ctx.from.id })

    if (isUserAlreadyAccepted) {
      await ctx.answerCallbackQuery()
      return
    }

    await db.acceptEvent({ eventId, userId: ctx.from.id })

    await ctx.answerCallbackQuery()

    let description = '-'

    try {
      description = (await db.getEvent({ id: eventId })).description
    }
    catch {}

    const botAdminIds = config.botAdmins
    botAdminIds.forEach(async (adminId) => {
      ctx.api.sendMessage(adminId, ctx.t('admin-user-accepted-event-message', {
        username: ctx.from.username ?? '–',
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name ?? '–',
        description,
      }))
    })

    return
  }

  await ctx.answerCallbackQuery()
})
