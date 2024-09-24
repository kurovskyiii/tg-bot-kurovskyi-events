import type { Context } from '@root/bot/common/context.js'

export function getSessionKey(ctx: Omit<Context, 'session'>) {
  return ctx.chat?.id.toString()
}
