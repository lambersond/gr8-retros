import { RetroBoardActionType } from '../types'
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
  | { type: RetroBoardActionType['SET_FROM_BOARD']; board: Board }
  | { type: RetroBoardActionType['ADD_CARD']; column: ColumnType; card: Card }
  | {
      type: RetroBoardActionType['UPDATE_CARD']
      column: ColumnType
      cardId: string
      patch: Partial<Card>
    }
  | {
      type: RetroBoardActionType['DELETE_CARD']
      column: ColumnType
      cardId: string
    }
  | {
      type: RetroBoardActionType['TOGGLE_UPVOTE']
      column: ColumnType
      cardId: string
      userId: string
    }
  | {
      type: RetroBoardActionType['MARK_DISCUSSED']
      column: ColumnType
      cardId: string
      isDiscussed: boolean
    }
  | {
      type: RetroBoardActionType['ADD_ACTION_ITEM']
      column: ColumnType
      cardId: string
      actionItem: ActionItem
    }
  | {
      type: RetroBoardActionType['TOGGLE_DONE_ACTION_ITEM']
      column: ColumnType
      cardId: string
      actionItemId: string
      isDone: boolean
    }
  | {
      type: RetroBoardActionType['UPDATE_ACTION_ITEM']
      column: ColumnType
      cardId: string
      actionItemId: string
      patch: Partial<ActionItem>
    }
