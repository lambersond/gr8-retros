import type { RetroBoardActionType } from '../types'
import type { ActionItem, Card, Comment, ColumnType } from '@/types'

type WithColumn<TType, TPayload> = {
  type: TType
  column: ColumnType
  payload: TPayload
}

type NoColumn<TType> = {
  type: TType
  column: never
  payload?: never
}

export type MessageData =
  | WithColumn<RetroBoardActionType['ADD_CARD'], Card>
  | WithColumn<
      RetroBoardActionType['UPDATE_CARD'],
      { cardId: string; column: ColumnType; patch: Partial<Card> }
    >
  | WithColumn<RetroBoardActionType['DELETE_CARD'], { cardId: string }>
  | WithColumn<
      RetroBoardActionType['TOGGLE_UPVOTE'],
      { cardId: string; userId: string }
    >
  | WithColumn<
      RetroBoardActionType['MARK_DISCUSSED'],
      { cardId: string; isDiscussed: boolean }
    >
  | WithColumn<
      RetroBoardActionType['ADD_ACTION_ITEM'],
      { cardId: string; actionItem: ActionItem }
    >
  | WithColumn<
      RetroBoardActionType['TOGGLE_DONE_ACTION_ITEM'],
      { cardId: string; actionItemId: string; isDone: boolean }
    >
  | WithColumn<
      RetroBoardActionType['UPDATE_ACTION_ITEM'],
      { cardId: string; actionItemId: string; patch: Partial<ActionItem> }
    >
  | NoColumn<RetroBoardActionType['DELETE_ALL_CARDS']>
  | NoColumn<RetroBoardActionType['DELETE_COMPLETED_CARDS']>
  | WithColumn<
      RetroBoardActionType['ADD_CARD_COMMENT'],
      { cardId: string; newComment: Comment }
    >
  | WithColumn<
      RetroBoardActionType['UPDATE_CARD_COMMENT'],
      { cardId: string; updatedComment: Comment }
    >
  | WithColumn<
      RetroBoardActionType['DELETE_CARD_COMMENT'],
      { cardId: string; commentId: string }
    >

export type Message = { data: MessageData }
