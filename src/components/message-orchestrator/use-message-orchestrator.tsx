import { useChannel } from 'ably/react'
import { useBoardAccessRequestsMessageHandlers } from '@/providers/retro-board/board-access-requests'
import { useBoardSettingsMessageHandlers } from '@/providers/retro-board/board-settings'
import { useBoardCardsMessageHandlers } from '@/providers/retro-board/cards'
import { useBoardColumnsMessageHandlers } from '@/providers/retro-board/columns'
import { useFacilitatorDiceMessageHandlers } from '@/providers/retro-board/facilitator-dice'
import type { WSMessage } from '@/types'

export function useMessageOrchestrator(channelId: string) {
  const settingsMessageHandlers = useBoardSettingsMessageHandlers()
  const cardsMessageHandlers = useBoardCardsMessageHandlers()
  const columnsMessageHandlers = useBoardColumnsMessageHandlers()
  const diceMessageHandlers = useFacilitatorDiceMessageHandlers()
  const accessRequestsMessageHandlers = useBoardAccessRequestsMessageHandlers()

  const handlers = {
    ...settingsMessageHandlers,
    ...cardsMessageHandlers,
    ...columnsMessageHandlers,
    ...diceMessageHandlers,
    ...accessRequestsMessageHandlers,
  }

  const onMessage = (msg: unknown) => {
    const { data } = msg as WSMessage<string, { type: string }>
    const handler = handlers[data.type as keyof typeof handlers]
    if (handler) {
      handler(data)
    } else {
      console.warn(`No handler found for message type: ${data.type}`)
    }
  }

  useChannel({ channelName: channelId }, onMessage)
}
