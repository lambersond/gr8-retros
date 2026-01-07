import { useCallback } from 'react'
import { AblyMessageCallback, useChannel } from 'ably/react'

export function useAblyMessageManager<
  S extends string,
  T extends { data: { type: S } },
>(channelName: string, handlers: Partial<Record<S, (data: any) => void>>) {
  const onMessage: AblyMessageCallback = useCallback(
    (message: unknown) => {
      const { data } = message as T
      const handler = handlers[data.type]
      if (handler) {
        handler(data)
      }
    },
    [handlers],
  )

  useChannel({ channelName }, onMessage)
}
