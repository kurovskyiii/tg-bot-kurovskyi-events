import type { BotConfig, StorageAdapter } from 'grammy'
import { Bot as TelegramBot } from 'grammy'

import { mainFeature } from '@root/bot/features/main.js'
import { adminFeature } from '@root/bot/features/admin.js'
import { unhandledFeature } from '@root/bot/features/unhandled.js'
import { errorHandler } from '@root/bot/handlers/index.js'
import { autoChatActionMiddleware, chatMembersMiddleware, hydrateMiddleware, i18nMiddleware, parseModeHydrateMiddleware, parseModeMiddleware, rateLimiterMiddleware, sequentializeMiddleware, sessionMiddleware, updateLoggerMiddleware } from '@root/bot/middlewares/index.js'
import { createContextConstructor } from '@root/bot/helpers/context.js'
import { scenes } from '@root/bot/scenes.js'

import type { Context, SessionData } from '@root/bot/common/context.js'
import type { Logger } from '@root/logger.js'
import type { Config } from '@root/config.js'

export function createBot(
  token: string,
  dependencies: {
    config: Config
    logger: Logger
  },
  options: {
    botSessionStorage?: StorageAdapter<SessionData>
    botConfig?: Omit<BotConfig<Context>, 'ContextConstructor'>
  } = {},
) {
  const {
    config,
    logger,
  } = dependencies

  const bot = new TelegramBot(token, {
    ...options.botConfig,
    ContextConstructor: createContextConstructor({
      logger,
      config,
    }),
  })
  const protectedBot = bot.errorBoundary(errorHandler)

  bot.api.config.use(parseModeMiddleware())
  // bot.api.config.use(autoRetryMiddleware())

  if (config.isPollingMode)
    protectedBot.use(sequentializeMiddleware())
  if (config.isDebug)
    protectedBot.use(updateLoggerMiddleware())

  protectedBot.use(autoChatActionMiddleware())
  protectedBot.use(parseModeHydrateMiddleware())
  protectedBot.use(hydrateMiddleware())
  protectedBot.use(sessionMiddleware())
  protectedBot.use(i18nMiddleware())
  protectedBot.use(chatMembersMiddleware())
  protectedBot.use(rateLimiterMiddleware())
  protectedBot.use(scenes.manager())

  // Handlers
  protectedBot.use(mainFeature)
  protectedBot.use(adminFeature)
  protectedBot.use(scenes)

  // must be the last handler
  protectedBot.use(unhandledFeature)

  return bot
}

export type Bot = ReturnType<typeof createBot>
