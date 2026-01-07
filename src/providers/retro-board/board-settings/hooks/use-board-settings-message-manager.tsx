import { useMemo } from 'react'
import { BOARD_SETTINGS_ACTION_TYPES } from '../constants'
import { useBoardSettingsDispatch } from '../provider'
import { useAblyMessageManager } from '@/hooks/use-ably-message-manager'
import type { BoardSettingsMessage, BoardSettingsMessageData } from '../types'

export function useBoardSettingsManager(boardId: string) {
  const dispatch = useBoardSettingsDispatch()

  const handlers = useMemo(() => {
    const h: Partial<
      Record<BoardSettingsMessageData['type'], (data: any) => void>
    > = {
      [BOARD_SETTINGS_ACTION_TYPES.UPDATE_BOARD_SETTINGS]: data => {
        dispatch({
          type: BOARD_SETTINGS_ACTION_TYPES.UPDATE_BOARD_SETTINGS,
          payload: data.payload,
        })
      },

      [BOARD_SETTINGS_ACTION_TYPES.CREATE_INVITATION_LINK]: data => {
        dispatch({
          type: BOARD_SETTINGS_ACTION_TYPES.CREATE_INVITATION_LINK,
          payload: data.payload,
        })
      },

      [BOARD_SETTINGS_ACTION_TYPES.REVOKE_INVITATION_LINK]: () => {
        dispatch({
          type: BOARD_SETTINGS_ACTION_TYPES.REVOKE_INVITATION_LINK,
        })
      },
    }
    return h
  }, [dispatch])

  useAblyMessageManager<BoardSettingsMessageData['type'], BoardSettingsMessage>(
    boardId,
    handlers,
  )
}
