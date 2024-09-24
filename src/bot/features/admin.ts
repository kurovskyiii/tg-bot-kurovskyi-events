import { Composer } from 'grammy'
import { isUserHasId } from 'grammy-guard'

import { logHandle } from '@root/bot/helpers/logging.js'
import { ADMIN_WELCOME_SCENE_ID } from '@root/bot/scenes/admin-welcome.js'
import { config } from '@root/config.js'

import type { Context } from '@root/bot/common/context.js'

export const adminFeature = new Composer<Context>()

const filteredAdminFeature = adminFeature.chatType('private').filter(isUserHasId(...config.botAdmins))

filteredAdminFeature.command('admin', logHandle('command-admin'), async (ctx) => {
  return ctx.scenes.enter(ADMIN_WELCOME_SCENE_ID)
})
