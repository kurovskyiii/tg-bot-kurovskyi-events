import type { Context } from '@root/bot/context.js'

export function checkCallbackActionExists({ actions, context }: { actions: string[], context: Context }): boolean {
  const choice = context.callbackQuery?.data

  if (!choice) {
    return false
  }

  return actions.includes(choice)
}

export async function sendUnavailableActionMessage({ context }: { context: Context }): Promise<void> {
  await context.reply(context.t('error-not-available-menu-action'))
}
