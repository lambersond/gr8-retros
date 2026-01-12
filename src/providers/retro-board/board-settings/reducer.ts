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
      boardSettingsWithPermissions,
      userPermissions: getUserBoardPermissions(userRole),
      user: getUserLevels(userRole),
    }
  },

  [BOARD_SETTINGS_ACTION_TYPES.UPDATE_BOARD_SETTINGS]: (state, action) => {
    const { members, ...updatedSettings } = action.payload

    return {
      ...state,
      settings: {
        ...state.settings,
        ...updatedSettings,
        members: members ?? state.settings.members,
      },
    }
  },

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
  [BOARD_SETTINGS_ACTION_TYPES.NEW_MEMBER_ADDED]: (state, action) => {
    const newMember = action.payload
    const existingMember = state.settings.members.find(
      member => member.user.id === newMember.user.id,
    )
    if (existingMember) {
      return state
    }

    return {
      ...state,
      settings: {
        ...state.settings,
        members: [...state.settings.members, newMember],
      },
    }
  },

  [BOARD_SETTINGS_ACTION_TYPES.MEMBER_REMOVED]: (state, action) => {
    const { userId } = action.payload
    return {
      ...state,
      settings: {
        ...state.settings,
        members: state.settings.members.filter(
          member => member.user.id !== userId,
        ),
      },
    }
  },

  [BOARD_SETTINGS_ACTION_TYPES.UPDATE_MEMBER_ROLE]: (state, action) => {
    const { userId, newRole } = action.payload
    return {
      ...state,
      settings: {
        ...state.settings,
        members: state.settings.members.map(member =>
          member.user.id === userId
            ? {
                ...member,
                role: newRole,
              }
            : member,
        ),
      },
    }
  },
}

export function reducer(
  state: BoardSettingsState,
  action: BoardSettingsReducerAction,
): BoardSettingsState {
  const handler = actionHandlers[action.type]
  return handler ? handler(state, action as never) : state
}
