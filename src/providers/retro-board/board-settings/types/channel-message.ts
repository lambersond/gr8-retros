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
        expiresAt: unknown
        token: string
      }
    }
  | {
      type: BoardSettingsReducerActionType['REVOKE_INVITATION_LINK']
    }
  | {
      type: BoardSettingsReducerActionType['NEW_MEMBER_ADDED']
      payload: {
        role: string
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
        newRole: string
      }
    }

export type BoardSettingsMessage = {
  data: BoardSettingsMessageData
}
