import { Composer } from 'grammy'

import { logHandle } from '@root/bot/helpers/logging.js'
import { WELCOME_SCENE_ID } from '@root/bot/scenes/welcome.js'

import type { Context } from '@root/bot/context.js'
import { isChannelMember } from '@root/bot/guards/isMyChatMember.js'

const composer = new Composer<Context>()

const feature = composer.chatType('private')

// feature.use(welcomeMainMenu)
feature.command('start', logHandle('command-start'), async (ctx) => {
  if (!(await isChannelMember(ctx))) {
    await ctx.reply(ctx.t('protection-intro-message'), { disable_notification: true })
    return
  }

  ctx.session.firstName = ctx.from.first_name
  ctx.session.lastName = ctx.from.last_name
  ctx.session.username = ctx.from.username

  await ctx.reply(ctx.t('welcome-initial-message'), { disable_notification: true })
  return ctx.scenes.enter(WELCOME_SCENE_ID)
})

export { composer as welcomeFeature }
