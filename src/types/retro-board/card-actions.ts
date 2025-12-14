import type { ActionItem, Board, Card, ColumnType, Comment } from '@/types'

export type CardActionType = {
  SET_FROM_BOARD: 'SET_FROM_BOARD'
  ADD_CARD: 'ADD_CARD'
  UPDATE_CARD: 'UPDATE_CARD'
  DELETE_CARD: 'DELETE_CARD'
  DELETE_ALL_CARDS: 'DELETE_ALL_CARDS'
  DELETE_COMPLETED_CARDS: 'DELETE_COMPLETED_CARDS'
  TOGGLE_UPVOTE: 'TOGGLE_UPVOTE'
  MARK_DISCUSSED: 'MARK_DISCUSSED'
  ADD_ACTION_ITEM: 'ADD_ACTION_ITEM'
  TOGGLE_DONE_ACTION_ITEM: 'TOGGLE_DONE_ACTION_ITEM'
  UPDATE_ACTION_ITEM: 'UPDATE_ACTION_ITEM'
  ADD_CARD_COMMENT: 'ADD_CARD_COMMENT'
  UPDATE_CARD_COMMENT: 'UPDATE_CARD_COMMENT'
  DELETE_CARD_COMMENT: 'DELETE_CARD_COMMENT'
}

export type CardAction =
  | { type: CardActionType['SET_FROM_BOARD']; board: Board }
  | { type: CardActionType['ADD_CARD']; column: ColumnType; card: Card }
  | {
      type: CardActionType['UPDATE_CARD']
      column: ColumnType
      cardId: string
      patch: Partial<Card>
    }
  | {
      type: CardActionType['DELETE_CARD']
      column: ColumnType
      cardId: string
    }
  | {
      type: CardActionType['TOGGLE_UPVOTE']
      column: ColumnType
      cardId: string
      userId: string
    }
  | {
      type: CardActionType['MARK_DISCUSSED']
      column: ColumnType
      cardId: string
      isDiscussed: boolean
    }
  | {
      type: CardActionType['ADD_ACTION_ITEM']
      column: ColumnType
      cardId: string
      actionItem: ActionItem
    }
  | {
      type: CardActionType['TOGGLE_DONE_ACTION_ITEM']
      column: ColumnType
      cardId: string
      actionItemId: string
      isDone: boolean
    }
  | {
      type: CardActionType['UPDATE_ACTION_ITEM']
      column: ColumnType
      cardId: string
      actionItemId: string
      patch: Partial<ActionItem>
    }
  | {
      type: CardActionType['DELETE_ALL_CARDS']
    }
  | {
      type: CardActionType['DELETE_COMPLETED_CARDS']
    }
  | {
      type: CardActionType['ADD_CARD_COMMENT']
      column: ColumnType
      newComment: Comment
    }
  | {
      type: CardActionType['UPDATE_CARD_COMMENT']
      column: ColumnType
      updatedComment: Comment
    }
  | {
      type: CardActionType['DELETE_CARD_COMMENT']
      column: ColumnType
      cardId: string
      commentId: string
    }
