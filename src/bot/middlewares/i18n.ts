import process from 'node:process'
import path from 'node:path'

import { I18n } from '@grammyjs/i18n'

import type { Context } from '@root/bot/common/context.js'

const i18n = new I18n<Context>({
  defaultLocale: 'ru',
  directory: path.resolve(process.cwd(), 'locales'),
  useSession: true,
  fluentBundleOptions: {
    useIsolating: false,
  },
})

export function i18nMiddleware() {
  return i18n
}
