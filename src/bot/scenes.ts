import { ScenesComposer } from 'grammy-scenes'

import { eventsScene, welcomeScene } from '@root/bot/scenes/index.js'
import type { Context } from '@root/bot/context.js'

export const scenes = new ScenesComposer<Context>()
scenes.scene(welcomeScene)
scenes.scene(eventsScene)
