import { type Api, Context as DefaultContext } from 'grammy'

import type { Update, UserFromGetMe } from '@grammyjs/types'

import type { Logger } from '@root/logger.js'
import type { Config } from '@root/config.js'

import type { Context, ExtendedContextFlavor } from '@root/bot/common/context.js'

export function createContextConstructor(
  {
    logger,
    config,
  }: {
    logger: Logger
    config: Config
  },
) {
  return class extends DefaultContext implements ExtendedContextFlavor {
    logger: Logger
    config: Config

    constructor(update: Update, api: Api, me: UserFromGetMe) {
      super(update, api, me)

      Object.defineProperty(this, 'logger', {
        writable: true,
      })

      this.logger = logger.child({
        update_id: this.update.update_id,
      })
      this.config = config
    }
  } as unknown as new (update: Update, api: Api, me: UserFromGetMe) => Context
}
