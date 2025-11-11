import * as utils from './utils'
import type { RetroBoardAction, RetroBoardState } from './types'

export function reducer(
  state: RetroBoardState,
  action: RetroBoardAction,
): RetroBoardState {
  switch (action.type) {
    case 'SET_FROM_BOARD': {
      return utils.createInitialState(action.board)
    }

    case 'ADD_CARD': {
      const { column, card } = action
      return {
        ...state,
        [column]: {
          cards: utils.sortCards([card, ...state[column].cards]),
        },
      }
    }

    case 'UPDATE_CARD': {
      const { column, cardId, patch } = action
      return {
        ...state,
        [column]: utils.updateCardInColumn(state[column], cardId, card => ({
          ...card,
          ...patch,
        })),
      }
    }

    case 'DELETE_CARD': {
      const { column, cardId } = action
      return {
        ...state,
        [column]: {
          cards: state[column].cards.filter(c => c.id !== cardId),
        },
      }
    }

    case 'TOGGLE_UPVOTE': {
      const { column, cardId, userId } = action
      return {
        ...state,
        [column]: utils.updateCardInColumn(state[column], cardId, card => {
          const hasUpvoted = card.upvotedBy.includes(userId)
          const upvotedBy = hasUpvoted
            ? card.upvotedBy.filter(id => id !== userId)
            : [...card.upvotedBy, userId]

          return { ...card, upvotedBy }
        }),
      }
    }

    case 'MARK_DISCUSSED': {
      const { column, cardId, isDiscussed } = action
      return {
        ...state,
        [column]: utils.updateCardInColumn(state[column], cardId, card => ({
          ...card,
          isDiscussed,
        })),
      }
    }

    case 'ADD_ACTION_ITEM': {
      const { column, cardId, actionItem } = action
      return {
        ...state,
        [column]: utils.updateCardInColumn(state[column], cardId, card => ({
          ...card,
          actionItems: [...card.actionItems, actionItem],
        })),
      }
    }

    case 'TOGGLE_DONE_ACTION_ITEM': {
      const { column, cardId, actionItemId, isDone } = action
      return {
        ...state,
        [column]: utils.updateCardInColumn(state[column], cardId, card => ({
          ...card,
          actionItems: card.actionItems.map(item =>
            item.id === actionItemId ? { ...item, isDone } : item,
          ),
        })),
      }
    }

    case 'UPDATE_ACTION_ITEM': {
      const { column, cardId, actionItemId, patch } = action
      return {
        ...state,
        [column]: utils.updateCardInColumn(state[column], cardId, card => ({
          ...card,
          actionItems: card.actionItems.map(item =>
            item.id === actionItemId ? { ...item, ...patch } : item,
          ),
        })),
      }
    }

    default: {
      throw new Error(`Unhandled action type: ${(action as any).type}`)
    }
  }
}
