import {
  useRetroBoard,
  useRetroBoardDispatch,
} from '../provider/retro-board-provider'
import type { ActionItem, Card, ColumnType } from '@/types'

export function useCards(column: ColumnType) {
  const state = useRetroBoard()
  const dispatch = useRetroBoardDispatch()

  const columnState = state[column]

  return {
    cards: columnState.cards,

    addCard(card: Card) {
      dispatch({ type: 'ADD_CARD', column, card })
    },

    updateCard(cardId: string, patch: Partial<Card>) {
      dispatch({
        type: 'UPDATE_CARD',
        column,
        cardId,
        patch,
      })
    },

    deleteCard(cardId: string) {
      dispatch({ type: 'DELETE_CARD', column, cardId })
    },

    toggleUpvote(cardId: string, userId: string) {
      dispatch({
        type: 'TOGGLE_UPVOTE',
        column,
        cardId,
        userId,
      })
    },

    markDiscussed(cardId: string, isDiscussed: boolean) {
      dispatch({
        type: 'MARK_DISCUSSED',
        column,
        cardId,
        isDiscussed,
      })
    },

    addActionItem(cardId: string, actionItem: Card['actionItems'][number]) {
      dispatch({
        type: 'ADD_ACTION_ITEM',
        column,
        cardId,
        actionItem,
      })
    },

    toggleDoneActionItem(
      cardId: string,
      actionItemId: string,
      isDone: boolean,
    ) {
      dispatch({
        type: 'TOGGLE_DONE_ACTION_ITEM',
        column,
        cardId,
        actionItemId,
        isDone,
      })
    },

    updateActionItem(
      cardId: string,
      actionItemId: string,
      patch: Partial<ActionItem>,
    ) {
      dispatch({
        type: 'UPDATE_ACTION_ITEM',
        column,
        cardId,
        actionItemId,
        patch,
      })
    },
  }
}
