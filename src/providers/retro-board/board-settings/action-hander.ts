import {
  BoardSettingsInternalActionType,
  BoardSettingsMessageType,
} from './enums'
import {
  getSettingsWithPermissions,
  getUserBoardPermissions,
  getUserLevels,
} from './utils'
import { BoardRole } from '@/enums'
import type { BoardSettingsReducerAction, ActionHandler } from './types'

export const boardCardActionHandlers = {
  [BoardSettingsInternalActionType.CLOSE_SIDEBAR]: state => ({
    ...state,
    sidebarOpen: false,
  }),

  [BoardSettingsInternalActionType.OPEN_SIDEBAR]: state => ({
    ...state,
    sidebarOpen: true,
  }),

  [BoardSettingsInternalActionType.UPDATE_PERMISSIONS]: (state, action) => {
    const { userRole = BoardRole.VIEWER } = action.payload
    const boardSettingsWithPermissions = getSettingsWithPermissions(
      state.settings,
      userRole,
    )
    return {
      ...state,
      boardSettingsWithPermissions,
      userPermissions: getUserBoardPermissions(userRole, state.settings),
      user: getUserLevels(userRole),
    }
  },

  [BoardSettingsMessageType.UPDATE_BOARD_SETTINGS]: (state, action) => {
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

  [BoardSettingsMessageType.CREATE_INVITATION_LINK]: (state, action) => {
    const invite = action.payload
    return {
      ...state,
      settings: {
        ...state.settings,
        invite,
      },
    }
  },

  [BoardSettingsMessageType.REVOKE_INVITATION_LINK]: state => ({
    ...state,
    settings: {
      ...state.settings,
      invite: undefined,
    },
  }),

  [BoardSettingsMessageType.NEW_MEMBER_ADDED]: (state, action) => {
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

  [BoardSettingsMessageType.MEMBER_REMOVED]: (state, action) => {
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

  [BoardSettingsMessageType.UPDATE_MEMBER_ROLE]: (state, action) => {
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
} satisfies {
  [K in
    | BoardSettingsMessageType
    | BoardSettingsInternalActionType]: ActionHandler<
    Extract<BoardSettingsReducerAction, { type: K }>
  >
}
