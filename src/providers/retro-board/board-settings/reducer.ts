import { BOARD_SETTINGS_ACTION_TYPES } from './constants'
import {
  getSettingsWithPermissions,
  getUserBoardPermissions,
  getUserLevels,
} from './utils'
import type { BoardSettingsReducerAction, BoardSettingsState } from './types'

type ActionHandler<
  A extends BoardSettingsReducerAction = BoardSettingsReducerAction,
> = (state: BoardSettingsState, action: A) => BoardSettingsState

const actionHandlers: {
  [K in BoardSettingsReducerAction['type']]: ActionHandler<
    Extract<BoardSettingsReducerAction, { type: K }>
  >
} = {
  [BOARD_SETTINGS_ACTION_TYPES.CLOSE_SIDEBAR]: state => ({
    ...state,
    sidebarOpen: false,
  }),

  [BOARD_SETTINGS_ACTION_TYPES.OPEN_SIDEBAR]: state => ({
    ...state,
    sidebarOpen: true,
  }),

  [BOARD_SETTINGS_ACTION_TYPES.UPDATE_PERMISSIONS]: (state, action) => {
    const { userRole = 'VIEWER' } = action.payload
    const boardSettingsWithPermissions = getSettingsWithPermissions(
      state.settings,
      userRole,
    )
    return {
      ...state,
      boardSettingsWithPermissions, // TODO: remove permissions from here
      userPermissions: getUserBoardPermissions(userRole),
      user: getUserLevels(userRole),
    }
  },

  [BOARD_SETTINGS_ACTION_TYPES.UPDATE_BOARD_SETTINGS]: (state, action) => ({
    ...state,
    settings: {
      ...state.settings,
      ...action.payload,
    },
  }),

  [BOARD_SETTINGS_ACTION_TYPES.CREATE_INVITATION_LINK]: (state, action) => {
    const invite = action.payload
    return {
      ...state,
      settings: {
        ...state.settings,
        invite,
      },
    }
  },

  [BOARD_SETTINGS_ACTION_TYPES.REVOKE_INVITATION_LINK]: state => ({
    ...state,
    settings: {
      ...state.settings,
      invite: undefined,
    },
  }),
}

export function reducer(
  state: BoardSettingsState,
  action: BoardSettingsReducerAction,
): BoardSettingsState {
  const handler = actionHandlers[action.type]
  return handler ? handler(state, action as never) : state
}
