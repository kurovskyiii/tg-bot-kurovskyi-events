import { ScenesComposer } from 'grammy-scenes'

import { adminBroadcastScene, adminEventsScene, adminWelcomeScene, eventsScene, questionsScene, welcomeScene } from '@root/bot/scenes/index.js'

import type { Context } from '@root/bot/common/context.js'

export const scenes = new ScenesComposer<Context>()

scenes.scene(welcomeScene)
scenes.scene(eventsScene)
scenes.scene(adminWelcomeScene)
scenes.scene(adminEventsScene)
scenes.scene(adminBroadcastScene)
scenes.scene(questionsScene)
