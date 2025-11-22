import { COMMENTS_SIDEBAR_ACTION_TYPES } from './constants'
import type { CommentsSidebarAction, CommentsSidebarState } from './types'

export function reducer(
  state: CommentsSidebarState,
  action: CommentsSidebarAction,
): CommentsSidebarState {
  switch (action.type) {
    case COMMENTS_SIDEBAR_ACTION_TYPES.CLOSE_SIDEBAR: {
      return {
        ...state,
        cardId: undefined,
        sidebarOpen: false,
        column: undefined,
      }
    }
    case COMMENTS_SIDEBAR_ACTION_TYPES.OPEN_SIDEBAR: {
      return {
        ...state,
        cardId: action.payload.cardId,
        column: action.payload.column,
        sidebarOpen: true,
      }
    }
    default: {
      return state
    }
  }
}
