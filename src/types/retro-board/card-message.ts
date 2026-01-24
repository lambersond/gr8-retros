import type { CardActionType } from './card-actions'
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

export type CardMessageData =
  | WithColumn<CardActionType['ADD_CARD'], Card>
  | WithColumn<
      CardActionType['UPDATE_CARD'],
      { cardId: string; column: ColumnType; patch: Partial<Card> }
    >
  | WithColumn<CardActionType['DELETE_CARD'], { cardId: string }>
  | WithColumn<
      CardActionType['TOGGLE_UPVOTE'],
      { cardId: string; userId: string }
    >
  | WithColumn<
      CardActionType['MARK_DISCUSSED'],
      { cardId: string; isDiscussed: boolean }
    >
  | WithColumn<
      CardActionType['ADD_ACTION_ITEM'],
      { cardId: string; actionItem: ActionItem }
    >
  | WithColumn<
      CardActionType['TOGGLE_DONE_ACTION_ITEM'],
      { cardId: string; actionItemId: string; isDone: boolean }
    >
  | WithColumn<
      CardActionType['UPDATE_ACTION_ITEM'],
      { cardId: string; actionItemId: string; patch: Partial<ActionItem> }
    >
  | NoColumn<CardActionType['DELETE_ALL_CARDS']>
  | NoColumn<CardActionType['DELETE_COMPLETED_CARDS']>
  | WithColumn<
      CardActionType['ADD_CARD_COMMENT'],
      { cardId: string; newComment: Comment }
    >
  | WithColumn<
      CardActionType['UPDATE_CARD_COMMENT'],
      { cardId: string; updatedComment: Comment }
    >
  | WithColumn<
      CardActionType['DELETE_CARD_COMMENT'],
      { cardId: string; commentId: string }
    >
  | WithColumn<
      CardActionType['DELETE_ACTION_ITEM'],
      { cardId: string; actionItemId: string }
    >

export type CardMessage = { data: CardMessageData }
