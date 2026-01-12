import { useCallback } from 'react'
import { AblyMessageCallback, useChannel } from 'ably/react'

export function useAblyMessageManager<
  S extends string,
  T extends { data: { type: S }; name?: string },
>(
  channelName: string,
  handlers: Partial<Record<S, (data: any, name?: string) => void>>,
) {
  const onMessage: AblyMessageCallback = useCallback(
    (message: unknown) => {
      const { data, name } = message as T
      const handler = handlers[data.type]
      if (handler) {
        handler(data, name)
      } else {
        console.warn(`No handler for message type: ${data.type}`)
      }
    },
    [handlers],
  )

  useChannel({ channelName }, onMessage)
}
