import type { ErrorHandler } from 'grammy'
import type { Context } from '@root/bot/common/context.js'
import { getUpdateInfo } from '@root/bot/helpers/logging.js'

export const errorHandler: ErrorHandler<Context> = (error) => {
  const { ctx } = error

  ctx.logger.error({
    err: error.error,
    update: getUpdateInfo(ctx),
  })
}
