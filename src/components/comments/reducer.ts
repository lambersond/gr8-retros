import type { CommentsAction, CommentsState } from './types'

export function reducer(
  state: CommentsState,
  action: CommentsAction,
): CommentsState {
  switch (action.type) {
    case 'ADD_COMMENT': {
      return {
        ...state,
        comments: [...state.comments, action.payload],
      }
    }
    case 'UPDATE_COMMENT': {
      return {
        ...state,
        comments: state.comments.map(comment =>
          comment.id === action.payload.id ? action.payload : comment,
        ),
      }
    }
    case 'REMOVE_COMMENT': {
      return {
        ...state,
        comments: state.comments.filter(
          comment => comment.id !== action.payload.id,
        ),
      }
    }
    case 'REMOVE_ALL_COMMENTS': {
      return {
        ...state,
        comments: [],
      }
    }
    case 'FETCH_COMMENTS_FOR_CARD': {
      return {
        ...state,
        cardId: action.payload.cardId,
        comments: action.payload.comments,
      }
    }
    case 'CLOSE_SIDEBAR': {
      return {
        cardId: undefined,
        comments: [],
        sidebarOpen: false,
      }
    }
    case 'OPEN_SIDEBAR': {
      return {
        cardId: action.payload.cardId,
        comments: action.payload.comments,
        sidebarOpen: true,
      }
    }
    default: {
      return state
    }
  }
}
