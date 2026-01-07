import type { BoardSettingsReducerActionType } from './reducer-action-type'
import type { BoardInvite, BoardRole, BoardSettings } from '@/types'

export type BoardSettingsReducerAction =
  | {
      type: BoardSettingsReducerActionType['OPEN_SIDEBAR']
    }
  | { type: BoardSettingsReducerActionType['CLOSE_SIDEBAR'] }
  | {
      type: BoardSettingsReducerActionType['UPDATE_BOARD_SETTINGS']
      payload: Partial<BoardSettings>
    }
  | {
      type: BoardSettingsReducerActionType['UPDATE_PERMISSIONS']
      payload: {
        userRole?: BoardRole
      }
    }
  | {
      type: BoardSettingsReducerActionType['CREATE_INVITATION_LINK']
      payload: BoardInvite
    }
  | {
      type: BoardSettingsReducerActionType['REVOKE_INVITATION_LINK']
    }
