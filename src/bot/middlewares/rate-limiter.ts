import { limit as rateLimiter } from '@grammyjs/ratelimiter'

import { getSessionKey } from '@root/bot/helpers/session.js'

import type { Context } from '@root/bot/common/context.js'

export function rateLimiterMiddleware() {
  return rateLimiter({
    timeFrame: 2000,
    limit: 3,
    onLimitExceeded: (ctx: Context) => {
      ctx?.reply(ctx.t('error-rate-limit-exceeded'))
    },
    keyGenerator: (ctx) => {
      if (ctx.chat?.type === 'private') {
        return getSessionKey(ctx)
      }
    },
  })
}
