#!/usr/bin/env tsx

import process from 'node:process'
import { type RunnerHandle, run } from '@grammyjs/runner'
import { logger } from '@root/logger.js'
import { createBot } from '@root/bot/bot.js'
import type { PollingConfig, WebhookConfig } from '@root/config.js'
import { config } from '@root/config.js'
import { createServer, createServerManager } from '@root/server/index.js'

async function startPolling(config: PollingConfig) {
  logger.info('Starting polling...')
  const bot = createBot(config.botToken, {
    config,
    logger,
  })
  let runner: undefined | RunnerHandle

  // graceful shutdown
  onShutdown(async () => {
    logger.info('Shutdown')
    await runner?.stop()
  })

  await Promise.all([
    bot.init(),
    bot.api.deleteWebhook(),
  ])

  // start bot
  runner = run(bot, {
    runner: {
      fetch: {
        allowed_updates: config.botAllowedUpdates,
      },
    },
  })

  logger.info({
    msg: 'Bot running...',
    username: bot.botInfo.username,
  })
}

async function startWebhook(config: WebhookConfig) {
  logger.info('Starting webhook...')
  logger.info('Creating bot...')
  const bot = createBot(config.botToken, {
    config,
    logger,
  })
  logger.info('Bot created.')
  logger.info('Creating server...')
  const server = createServer({
    bot,
    config,
    logger,
  })
  logger.info('Server created.')
  logger.info('Creating server manager...')
  const serverManager = createServerManager(server, {
    host: config.serverHost,
    port: config.serverPort,
  })
  logger.info('Server manager created.')

  // graceful shutdown
  onShutdown(async () => {
    logger.info('Shutdown')
    await serverManager.stop()
  })

  logger.info('Initializing bot...')
  // to prevent receiving updates before the bot is ready
  await bot.init()

  logger.info('Starting server...')
  // start server
  const info = await serverManager.start()
  logger.info({
    msg: 'Server started',
    url: info.url,
  })

  // set webhook
  await bot.api.setWebhook(config.botWebhook, {
    allowed_updates: config.botAllowedUpdates,
    secret_token: config.botWebhookSecret,
  })
  logger.info({
    msg: 'Webhook was set',
    url: config.botWebhook,
  })
}

try {
  if (config.isWebhookMode)
    await startWebhook(config)
  else if (config.isPollingMode)
    await startPolling(config)
}
catch (error) {
  logger.error(error)
  process.exit(1)
}

// Utils

function onShutdown(cleanUp: () => Promise<void>) {
  let isShuttingDown = false
  const handleShutdown = async () => {
    if (isShuttingDown)
      return
    isShuttingDown = true
    await cleanUp()
  }
  process.on('SIGINT', handleShutdown)
  process.on('SIGTERM', handleShutdown)
}
