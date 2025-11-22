import { ACTION_TYPES } from '../constants'
import * as utils from './utils'
import type { RetroBoardAction, RetroBoardState } from './types'

export function reducer(
  state: RetroBoardState,
  action: RetroBoardAction,
): RetroBoardState {
  switch (action.type) {
    case ACTION_TYPES.SET_FROM_BOARD: {
      return utils.createInitialState(action.board)
    }

    case ACTION_TYPES.ADD_CARD: {
      const { column, card } = action
      return {
        ...state,
        [column]: {
          cards: utils.sortCards([card, ...state[column].cards]),
        },
      }
    }

    case ACTION_TYPES.UPDATE_CARD: {
      const { column, cardId, patch } = action
      return {
        ...state,
        [column]: utils.updateCardInColumn(state[column], cardId, card => ({
          ...card,
          ...patch,
        })),
      }
    }

    case ACTION_TYPES.DELETE_CARD: {
      const { column, cardId } = action
      return {
        ...state,
        [column]: {
          cards: state[column].cards.filter(c => c.id !== cardId),
        },
      }
    }

    case ACTION_TYPES.TOGGLE_UPVOTE: {
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

    case ACTION_TYPES.MARK_DISCUSSED: {
      const { column, cardId, isDiscussed } = action
      return {
        ...state,
        [column]: utils.updateCardInColumn(state[column], cardId, card => ({
          ...card,
          isDiscussed,
        })),
      }
    }

    case ACTION_TYPES.ADD_ACTION_ITEM: {
      const { column, cardId, actionItem } = action
      return {
        ...state,
        [column]: utils.updateCardInColumn(state[column], cardId, card => ({
          ...card,
          actionItems: [...card.actionItems, actionItem],
        })),
      }
    }

    case ACTION_TYPES.TOGGLE_DONE_ACTION_ITEM: {
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

    case ACTION_TYPES.UPDATE_ACTION_ITEM: {
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

    case ACTION_TYPES.DELETE_ALL_CARDS: {
      const newState: RetroBoardState = {
        ...state,
        GOOD: { cards: [] },
        MEH: { cards: [] },
        BAD: { cards: [] },
        SHOUTOUT: { cards: [] },
      }
      return newState
    }

    case ACTION_TYPES.DELETE_COMPLETED_CARDS: {
      const newState: RetroBoardState = {
        ...state,
        GOOD: {
          cards: utils.filterCompletedCards(state.GOOD.cards),
        },
        MEH: {
          cards: utils.filterCompletedCards(state.MEH.cards),
        },
        BAD: {
          cards: utils.filterCompletedCards(state.BAD.cards),
        },
        SHOUTOUT: {
          cards: utils.filterCompletedCards(state.SHOUTOUT.cards),
        },
      }
      return newState
    }

    case ACTION_TYPES.ADD_CARD_COMMENT: {
      const { column, newComment } = action
      return {
        ...state,
        [column]: utils.updateCardInColumn(
          state[column],
          newComment.cardId,
          card => ({
            ...card,
            comments: [...card.comments, newComment],
          }),
        ),
      }
    }
    case ACTION_TYPES.UPDATE_CARD_COMMENT: {
      const { column, updatedComment } = action
      return {
        ...state,
        [column]: utils.updateCardInColumn(
          state[column],
          updatedComment.cardId,
          card => ({
            ...card,
            comments: card.comments.map(comment =>
              comment.id === updatedComment.id ? updatedComment : comment,
            ),
          }),
        ),
      }
    }
    case ACTION_TYPES.DELETE_CARD_COMMENT: {
      const { column, cardId, commentId } = action
      return {
        ...state,
        [column]: utils.updateCardInColumn(state[column], cardId, card => ({
          ...card,
          comments: card.comments.filter(comment => comment.id !== commentId),
        })),
      }
    }

    default: {
      throw new Error(`Unhandled action type: ${(action as any).type}`)
    }
  }
}
