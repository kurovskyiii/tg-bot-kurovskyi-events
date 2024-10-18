import { autoRetry } from '@grammyjs/auto-retry'

export function autoRetryMiddleware() {
  return autoRetry({
    maxDelaySeconds: 60,
    maxRetryAttempts: 5,
  })
}
