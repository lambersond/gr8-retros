import type { BoardSettingsReducerActionType } from './reducer-action-type'
import type { BoardRole } from '@/enums'
import type { BoardInvite, BoardSettings } from '@/types'

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
  | {
      type: BoardSettingsReducerActionType['NEW_MEMBER_ADDED']
      payload: {
        role: BoardRole
        permissionMask: number
        user: {
          id: string
          name: string
        }
      }
    }
  | {
      type: BoardSettingsReducerActionType['MEMBER_REMOVED']
      payload: {
        userId: string
      }
    }
  | {
      type: BoardSettingsReducerActionType['UPDATE_MEMBER_ROLE']
      payload: {
        userId: string
        newRole: BoardRole
      }
    }
