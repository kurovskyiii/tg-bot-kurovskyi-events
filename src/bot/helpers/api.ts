import type { Api, Context } from 'grammy'

export function createBroadcastMessageMethod(context: Context) {
  type ModifyFirstArg<F, NewArg> = F extends (arg1: infer _, ...args: infer Rest) => infer R
    ? (arg1: NewArg, ...args: Rest) => R
    : never

  type ModifyReturn<F, NewReturn> = F extends (...args: infer Args) => infer _
    ? (...args: Args) => NewReturn
    : never

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const broadcastMessage: ModifyReturn<
    ModifyFirstArg<
      Api['sendMessage'],
      (string | number)[]
    >,
    Promise<import('@grammyjs/types/message.js').Message.TextMessage[]>
  > = async (chatIds, text, other, signal) => {
    const results = []

    for (const chatId of chatIds) {
      const result = await context.api.sendMessage(chatId, text, other, signal)
      results.push(result)
      await delay(1000)
    }

    return results
  }

  return broadcastMessage
}
