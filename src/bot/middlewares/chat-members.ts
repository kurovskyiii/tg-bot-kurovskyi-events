import { chatMembers } from '@grammyjs/chat-members'
import { MemorySessionStorage } from 'grammy'

import type { ChatMember } from '@grammyjs/types'

export const chatMembersMiddleware = () => chatMembers(new MemorySessionStorage<ChatMember>())
