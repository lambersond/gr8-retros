/* eslint-disable unicorn/no-null */
import { DEFAULT_STATE } from './constants'
import {
  BoardCardsMessageType,
  BoardCardsInternalActionType,
  BoardCardsFilterOptions,
  BoardCardsSortOptions,
} from './enums'
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
      cards: {},
      groups: {},
      filter: state.filter,
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
  [BoardCardsMessageType.UPDATE_CARDS_COLUMN]: (state, action) => {
    const { columnCorrections } = action

    const newCards = { ...state.cards }
    for (const card of Object.values(newCards)) {
      for (const { from, to } of columnCorrections) {
        if (card.column === from) {
          newCards[card.id] = { ...card, column: to }
        }
      }
    }
    return { ...state, cards: newCards }
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
  [BoardCardsMessageType.SORT_CARDS]: (state, action) => {
    return { ...state, sort: action.sort }
  },
  [BoardCardsInternalActionType.FILTER_CARDS]: (state, action) => {
    return { ...state, filter: action.filter }
  },
  [BoardCardsInternalActionType.CLOSE_VOTING_RESULTS]: (state, action) => {
    const newStateCards = { ...state.cards }
    for (const [cardId, votes] of Object.entries(action.votingResults)) {
      const card = newStateCards[cardId]
      if (card) {
        newStateCards[cardId] = { ...card, votes: votes.length }
      }
    }
    return {
      ...state,
      cards: newStateCards,
      filter: BoardCardsFilterOptions.WITH_VOTES,
      sort: BoardCardsSortOptions.BY_VOTES,
    }
  },
  [BoardCardsInternalActionType.RESET_VOTING_RESULTS]: state => {
    const newStateCards = { ...state.cards }
    for (const card of Object.values(newStateCards)) {
      newStateCards[card.id] = { ...card, votes: 0 }
    }
    return {
      ...state,
      cards: newStateCards,
      filter: BoardCardsFilterOptions.ALL,
      sort: BoardCardsSortOptions.NONE,
    }
  },
  [BoardCardsMessageType.CREATE_CARD_GROUP]: (state, action) => {
    const { group, cardIds } = action
    const newCards = { ...state.cards }
    for (const cardId of cardIds) {
      if (newCards[cardId]) {
        newCards[cardId] = {
          ...newCards[cardId],
          cardGroupId: group.id,
          position: undefined,
        }
      }
    }
    return {
      ...state,
      cards: newCards,
      groups: { ...state.groups, [group.id]: group },
    }
  },
  [BoardCardsMessageType.ADD_CARD_TO_GROUP]: (state, action) => {
    const { cardId, groupId } = action
    const group = state.groups[groupId]
    if (!group || !state.cards[cardId]) return state
    if (group.cardIds.includes(cardId)) return state

    const newCards = {
      ...state.cards,
      [cardId]: {
        ...state.cards[cardId],
        cardGroupId: groupId,
        position: undefined,
      },
    }
    const newGroups = {
      ...state.groups,
      [groupId]: { ...group, cardIds: [...group.cardIds, cardId] },
    }
    return { ...state, cards: newCards, groups: newGroups }
  },
  [BoardCardsMessageType.REMOVE_CARD_FROM_GROUP]: (state, action) => {
    const { cardId, groupId, position } = action
    const group = state.groups[groupId]
    if (!group || !state.cards[cardId]) return state

    const newCardIds = group.cardIds.filter(id => id !== cardId)
    const newCards = {
      ...state.cards,
      [cardId]: {
        ...state.cards[cardId],
        cardGroupId: null,
        position,
      },
    }

    // Dissolve group if only 1 card remains
    if (newCardIds.length <= 1) {
      const newGroups = { ...state.groups }
      delete newGroups[groupId]
      // Restore remaining card to standalone
      const remainingId = newCardIds[0]
      if (remainingId && newCards[remainingId]) {
        newCards[remainingId] = {
          ...newCards[remainingId],
          cardGroupId: null,
          position: group.position ?? 0,
        }
      }
      return { ...state, cards: newCards, groups: newGroups }
    }

    return {
      ...state,
      cards: newCards,
      groups: {
        ...state.groups,
        [groupId]: { ...group, cardIds: newCardIds },
      },
    }
  },
  [BoardCardsMessageType.DELETE_CARD_GROUP]: (state, action) => {
    const { groupId, restoredCards } = action
    const newGroups = { ...state.groups }
    delete newGroups[groupId]

    const newCards = { ...state.cards }
    for (const { cardId, position } of restoredCards) {
      if (newCards[cardId]) {
        newCards[cardId] = {
          ...newCards[cardId],
          cardGroupId: null,
          position,
        }
      }
    }
    return { ...state, cards: newCards, groups: newGroups }
  },
  [BoardCardsMessageType.UPDATE_CARD_GROUP]: (state, action) => {
    const { groupId, patch } = action
    const group = state.groups[groupId]
    if (!group) return state
    return {
      ...state,
      groups: { ...state.groups, [groupId]: { ...group, ...patch } },
    }
  },
  [BoardCardsMessageType.UPDATE_CARD_POSITION]: (state, action) => {
    const { cardId, position, column } = action
    return utils.updateCard(state, cardId, card => ({
      ...card,
      position,
      column,
    }))
  },
  [BoardCardsMessageType.UPDATE_GROUP_POSITION]: (state, action) => {
    const { groupId, position, column } = action
    const group = state.groups[groupId]
    if (!group) return state

    const newCards = { ...state.cards }
    if (column !== group.column) {
      for (const cardId of group.cardIds) {
        if (newCards[cardId]) {
          newCards[cardId] = { ...newCards[cardId], column }
        }
      }
    }

    return {
      ...state,
      cards: newCards,
      groups: { ...state.groups, [groupId]: { ...group, position, column } },
    }
  },
  [BoardCardsInternalActionType.RESYNC_CARDS]: (state, action) => {
    const newState = utils.createInitialState(
      action.board,
      state.sort,
      state.filter,
    )
    return newState
  },
}
