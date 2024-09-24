import { sequentialize } from '@grammyjs/runner'

import { getSessionKey } from '@root/bot/helpers/session.js'

export const sequentializeMiddleware = () => sequentialize(getSessionKey)
