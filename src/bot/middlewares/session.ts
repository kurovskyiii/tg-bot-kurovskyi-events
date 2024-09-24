import { FileAdapter } from '@grammyjs/storage-file'
import { session } from 'grammy'

import { getSessionKey } from '@root/bot/helpers/session.js'

import type { SessionData } from '@root/bot/common/context.js'

export function sessionMiddleware() {
  return session({ getSessionKey, storage: new FileAdapter<SessionData>({
    dirName: 'data/sessions',
  }), initial: () => ({}) })
}
