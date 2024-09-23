import { config } from '@root/config.js'

import type { Context } from '@root/bot/context.js'

export async function isChannelMember(ctx: Context): Promise<boolean> {
  const chatMember = await ctx.chatMembers.getChatMember(
    config.channelIds[0],
    ctx.from?.id,
  )

  return !!chatMember.user
}
