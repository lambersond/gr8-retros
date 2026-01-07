import type { BoardSettingsReducerActionType } from './reducer-action-type'
import type { BoardSettings } from '@/types'

export type BoardSettingsMessageData =
  | {
      type: BoardSettingsReducerActionType['UPDATE_BOARD_SETTINGS']
      payload: Partial<BoardSettings>
    }
  | {
      type: BoardSettingsReducerActionType['CREATE_INVITATION_LINK']
      payload: {
        expiresAt: unknown | undefined
        token: string
      }
    }
  | {
      type: BoardSettingsReducerActionType['REVOKE_INVITATION_LINK']
    }

export type BoardSettingsMessage = {
  data: BoardSettingsMessageData
}
