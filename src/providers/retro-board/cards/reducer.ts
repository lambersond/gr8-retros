import * as utils from './utils'
import { CARD_ACTION } from '@/constants/retro-board'
import type { CardsState } from './types'
import type { CardAction } from '@/types/retro-board'

export function reducer(state: CardsState, action: CardAction) {
  switch (action.type) {
    case CARD_ACTION.SET_FROM_BOARD: {
      return utils.createInitialState(action.board)
    }

    case CARD_ACTION.ADD_CARD: {
      const { column, card } = action
      return {
        ...state,
        [column]: {
          cards: utils.sortCards([card, ...state[column].cards]),
        },
      }
    }

    case CARD_ACTION.UPDATE_CARD: {
      const { column, cardId, patch } = action
      return {
        ...state,
        [column]: utils.updateCardInColumn(state[column], cardId, card => ({
          ...card,
          ...patch,
        })),
      }
    }

    case CARD_ACTION.DELETE_CARD: {
      const { column, cardId } = action
      return {
        ...state,
        [column]: {
          cards: state[column].cards.filter(c => c.id !== cardId),
        },
      }
    }

    case CARD_ACTION.TOGGLE_UPVOTE: {
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

    case CARD_ACTION.MARK_DISCUSSED: {
      const { column, cardId, isDiscussed } = action
      return {
        ...state,
        [column]: utils.updateCardInColumn(state[column], cardId, card => ({
          ...card,
          isDiscussed,
        })),
      }
    }

    case CARD_ACTION.ADD_ACTION_ITEM: {
      const { column, cardId, actionItem } = action
      return {
        ...state,
        [column]: utils.updateCardInColumn(state[column], cardId, card => ({
          ...card,
          actionItems: [...card.actionItems, actionItem],
        })),
      }
    }

    case CARD_ACTION.TOGGLE_DONE_ACTION_ITEM: {
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

    case CARD_ACTION.UPDATE_ACTION_ITEM: {
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

    case CARD_ACTION.DELETE_ALL_CARDS: {
      const newState: CardsState = {
        ...state,
        GOOD: { cards: [] },
        MEH: { cards: [] },
        BAD: { cards: [] },
        SHOUTOUT: { cards: [] },
      }
      return newState
    }

    case CARD_ACTION.DELETE_COMPLETED_CARDS: {
      const newState: CardsState = {
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

    case CARD_ACTION.ADD_CARD_COMMENT: {
      const { column, newComment } = action
      return {
        ...state,
        [column]: utils.updateCardInColumn(
          state[column],
          newComment.cardId,
          card => {
            const comments = card?.comments || []
            return {
              ...card,
              comments: [...comments, newComment],
            }
          },
        ),
      }
    }

    case CARD_ACTION.UPDATE_CARD_COMMENT: {
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

    case CARD_ACTION.DELETE_CARD_COMMENT: {
      const { column, cardId, commentId } = action
      return {
        ...state,
        [column]: utils.updateCardInColumn(state[column], cardId, card => ({
          ...card,
          comments: card.comments.filter(comment => comment.id !== commentId),
        })),
      }
    }

    case CARD_ACTION.SORT_CARDS: {
      const { sort } = action
      const newState: CardsState = {
        ...state,
        GOOD: {
          cards: utils.sortCardsBy(state.GOOD.cards, sort),
        },
        MEH: {
          cards: utils.sortCardsBy(state.MEH.cards, sort),
        },
        BAD: {
          cards: utils.sortCardsBy(state.BAD.cards, sort),
        },
        SHOUTOUT: {
          cards: utils.sortCardsBy(state.SHOUTOUT.cards, sort),
        },
      }
      return newState
    }

    default: {
      throw new Error(`Unhandled action type: ${(action as any).type}`)
    }
  }
}
