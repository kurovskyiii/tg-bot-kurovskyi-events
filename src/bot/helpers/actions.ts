import type { Context } from '@root/bot/common/context.js'

export function checkCallbackActionExists({ actions, choice }: { actions: string[], choice: string }): boolean {
  if (!choice) {
    return false
  }

  return actions.includes(choice)
}

export async function sendUnavailableActionMessage({ context }: { context: Context }): Promise<void> {
  await context.reply(context.t('error-not-available-menu-action'))
}
