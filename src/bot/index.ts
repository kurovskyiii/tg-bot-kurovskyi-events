import { autoChatAction } from '@grammyjs/auto-chat-action'
import { hydrate } from '@grammyjs/hydrate'
import { hydrateReply, parseMode } from '@grammyjs/parse-mode'
import type { BotConfig, StorageAdapter } from 'grammy'
import { MemorySessionStorage, Bot as TelegramBot, session } from 'grammy'
import { sequentialize } from '@grammyjs/runner'
import { welcomeFeature } from '@root/bot/features/welcome.js'
import { unhandledFeature } from '@root/bot/features/unhandled.js'
import { errorHandler } from '@root/bot/handlers/error.js'
import { updateLogger } from '@root/bot/middlewares/update-logger.js'
import type { Context, SessionData } from '@root/bot/context.js'
import { createContextConstructor } from '@root/bot/context.js'
import { i18n } from '@root/bot/i18n.js'
import type { Logger } from '@root/logger.js'
import type { Config } from '@root/config.js'
import { scenes } from '@root/bot/scenes.js'
import { FileAdapter } from '@grammyjs/storage-file'
import { chatMembers } from '@grammyjs/chat-members'
import type { ChatMember } from 'grammy/types'

interface Dependencies {
  config: Config
  logger: Logger
}

interface Options {
  botSessionStorage?: StorageAdapter<SessionData>
  botConfig?: Omit<BotConfig<Context>, 'ContextConstructor'>
}

function getSessionKey(ctx: Omit<Context, 'session'>) {
  return ctx.chat?.id.toString()
}

export function createBot(token: string, dependencies: Dependencies, options: Options = {}) {
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

  // Middlewares
  bot.api.config.use(parseMode('HTML'))

  if (config.isPollingMode)
    protectedBot.use(sequentialize(getSessionKey))
  if (config.isDebug)
    protectedBot.use(updateLogger())
  protectedBot.use(autoChatAction(bot.api))
  protectedBot.use(hydrateReply)
  protectedBot.use(hydrate())
  protectedBot.use(session({ getSessionKey, storage: new FileAdapter<SessionData>({
    dirName: 'sessions',
  }), initial: () => ({ subscriptions: [] }) }))
  protectedBot.use(i18n)
  protectedBot.use(scenes.manager())
  protectedBot.use(chatMembers(new MemorySessionStorage<ChatMember>()))

  // Handlers
  protectedBot.use(welcomeFeature)
  protectedBot.use(scenes)

  // must be the last handler
  protectedBot.use(unhandledFeature)

  return bot
}

export type Bot = ReturnType<typeof createBot>
