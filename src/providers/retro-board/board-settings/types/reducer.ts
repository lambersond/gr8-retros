import type { BoardSettingsMessageData } from './channel-messages'
import type { BoardSettingsInternalActionType } from '../enums'
import type { BoardSettingsState } from './provider'
import type { BoardRole } from '@/enums'
import type { MessageStructRequiredPayload } from '@/types'

export type ActionHandler<
  A extends BoardSettingsReducerAction = BoardSettingsReducerAction,
> = (state: BoardSettingsState, action: A) => BoardSettingsState

export type BoardSettingsReducerAction =
  | { type: BoardSettingsInternalActionType.OPEN_SIDEBAR }
  | { type: BoardSettingsInternalActionType.CLOSE_SIDEBAR }
  | MessageStructRequiredPayload<
      BoardSettingsInternalActionType.UPDATE_PERMISSIONS,
      { userRole: BoardRole | undefined }
    >
  | BoardSettingsMessageData
