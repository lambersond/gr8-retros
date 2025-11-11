import type { ActionItem, Board, Card, ColumnType } from '@/types'

export type ColumnState = {
  cards: Card[]
}

export type RetroBoardState = {
  id: string
  name: string | null
  isPrivate: boolean
  GOOD: ColumnState
  MEH: ColumnState
  BAD: ColumnState
  SHOUTOUT: ColumnState
}

export type RetroBoardAction =
  | { type: 'SET_FROM_BOARD'; board: Board }
  | { type: 'ADD_CARD'; column: ColumnType; card: Card }
  | {
      type: 'UPDATE_CARD'
      column: ColumnType
      cardId: string
      patch: Partial<Card>
    }
  | { type: 'DELETE_CARD'; column: ColumnType; cardId: string }
  | {
      type: 'TOGGLE_UPVOTE'
      column: ColumnType
      cardId: string
      userId: string
    }
  | {
      type: 'MARK_DISCUSSED'
      column: ColumnType
      cardId: string
      isDiscussed: boolean
    }
  | {
      type: 'ADD_ACTION_ITEM'
      column: ColumnType
      cardId: string
      actionItem: ActionItem
    }
  | {
      type: 'TOGGLE_DONE_ACTION_ITEM'
      column: ColumnType
      cardId: string
      actionItemId: string
      isDone: boolean
    }
  | {
      type: 'UPDATE_ACTION_ITEM'
      column: ColumnType
      cardId: string
      actionItemId: string
      patch: Partial<ActionItem>
    }
