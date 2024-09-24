import type { Context as DefaultContext, SessionFlavor } from 'grammy'
import type { AutoChatActionFlavor } from '@grammyjs/auto-chat-action'
import type { HydrateFlavor } from '@grammyjs/hydrate'
import type { I18nFlavor } from '@grammyjs/i18n'
import type { ParseModeFlavor } from '@grammyjs/parse-mode'
import type { ConversationFlavor } from '@grammyjs/conversations'
import type { ScenesFlavor, ScenesSessionData } from 'grammy-scenes'
import type { ChatMembersFlavor } from '@grammyjs/chat-members'

import type { Logger } from '@root/logger.js'
import type { Config } from '@root/config.js'

export type SessionData = ScenesSessionData & {
}

export interface ExtendedContextFlavor {
  logger: Logger
  config: Config
}

export type Context = ParseModeFlavor<
  HydrateFlavor<
    DefaultContext &
    ExtendedContextFlavor &
    SessionFlavor<SessionData> &
    ScenesFlavor &
    I18nFlavor &
    ConversationFlavor &
    AutoChatActionFlavor & ChatMembersFlavor
  >
>
