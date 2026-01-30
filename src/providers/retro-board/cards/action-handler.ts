import { DEFAULT_STATE } from './constants'
import { BoardCardsMessageType, BoardCardsInternalActionType } from './enums'
import * as utils from './utils'
import type { ActionHandler, BoardCardsReducerAction } from './types'

export const boardCardActionHandlers: {
  [K in BoardCardsMessageType | BoardCardsInternalActionType]: ActionHandler<
    Extract<BoardCardsReducerAction, { type: K }>
  >
} = {
  [BoardCardsMessageType.ADD_CARD]: (state, action) => {
    return {
      ...state,
      cards: { ...state.cards, [action.card.id]: action.card },
    }
  },
  [BoardCardsMessageType.UPDATE_CARD]: (state, action) => {
    const { cardId, patch } = action
    return utils.updateCard(state, cardId, card => ({
      ...card,
      ...patch,
    }))
  },
  [BoardCardsMessageType.DELETE_CARD]: (state, action) => {
    delete state.cards[action.cardId]
    return { ...state }
  },
  [BoardCardsMessageType.DELETE_ALL_CARDS]: state => {
    return {
      ...DEFAULT_STATE,
      sort: state.sort,
    }
  },
  [BoardCardsMessageType.DELETE_COMPLETED_CARDS]: state => {
    const newState = { ...DEFAULT_STATE, sort: state.sort }

    for (const card of Object.values(state.cards)) {
      if (!card.isDiscussed || card.actionItems.some(item => !item.isDone)) {
        newState.cards[card.id] = card
      }
    }
    return newState
  },
  [BoardCardsMessageType.TOGGLE_UPVOTE]: (state, action) => {
    const { cardId, userId } = action

    return utils.updateCard(state, cardId, card => {
      const hasUpvoted = card.upvotedBy.includes(userId)
      const upvotedBy = hasUpvoted
        ? card.upvotedBy.filter(id => id !== userId)
        : [...card.upvotedBy, userId]

      return { ...card, upvotedBy }
    })
  },
  [BoardCardsMessageType.ADD_ACTION_ITEM]: (state, action) => {
    const { cardId, actionItem } = action
    return utils.updateCard(state, cardId, card => ({
      ...card,
      actionItems: [...card.actionItems, actionItem],
    }))
  },
  [BoardCardsMessageType.UPDATE_ACTION_ITEM]: (state, action) => {
    const { cardId, actionItemId, patch } = action
    return utils.updateCard(state, cardId, card => ({
      ...card,
      actionItems: card.actionItems.map(ai =>
        ai.id === actionItemId ? { ...ai, ...patch } : ai,
      ),
    }))
  },
  [BoardCardsMessageType.DELETE_ACTION_ITEM]: (state, action) => {
    const { cardId, actionItemId } = action
    return utils.updateCard(state, cardId, card => ({
      ...card,
      actionItems: card.actionItems.filter(ai => ai.id !== actionItemId),
    }))
  },
  [BoardCardsMessageType.ADD_CARD_COMMENT]: (state, action) => {
    const { comment, cardId } = action

    return utils.updateCard(state, cardId, card => {
      const comments = card?.comments || []
      return {
        ...card,
        comments: [...comments, comment],
      }
    })
  },
  [BoardCardsMessageType.UPDATE_CARD_COMMENT]: (state, action) => {
    const { patch, cardId } = action
    return utils.updateCard(state, cardId, card => ({
      ...card,
      comments: card.comments.map(comment =>
        comment.id === patch.id ? { ...comment, ...patch } : comment,
      ),
    }))
  },
  [BoardCardsMessageType.DELETE_CARD_COMMENT]: (state, action) => {
    const { cardId, commentId } = action
    return utils.updateCard(state, cardId, card => ({
      ...card,
      comments: card.comments.filter(comment => comment.id !== commentId),
    }))
  },
  [BoardCardsInternalActionType.SORT_CARDS]: (state, action) => {
    return { ...state, sort: action.sort }
  },
}
