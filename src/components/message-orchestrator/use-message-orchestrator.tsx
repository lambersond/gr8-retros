import { useChannel } from 'ably/react'
import { useBoardSettingsMessageHandlers } from '@/providers/retro-board/board-settings'
import { useBoardCardsMessageHandlers } from '@/providers/retro-board/cards'
import type { WSMessage } from '@/types'

export function useMessageOrchestrator(channelId: string) {
  const settingsMessageHandlers = useBoardSettingsMessageHandlers()
  const cardsMessageHandlers = useBoardCardsMessageHandlers()

  const handlers = {
    ...settingsMessageHandlers,
    ...cardsMessageHandlers,
  }

  const onMessage = (msg: unknown) => {
    const { data } = msg as WSMessage<string, any & { type: string }>
    const handler = handlers[data.type as keyof typeof handlers]
    if (handler) {
      handler(data)
    } else {
      console.warn(`No handler found for message type: ${data.type}`)
    }
  }

  useChannel({ channelName: channelId }, onMessage)
}
