import type { BoardCardsMessageType } from '../enums'
import type { ActionItem, Card, Comment, MessageStruct } from '@/types'

export type CardMessageData =
  | MessageStruct<BoardCardsMessageType.ADD_CARD, Card>
  | MessageStruct<
      BoardCardsMessageType.UPDATE_CARD,
      { cardId: string; patch: Partial<Card> }
    >
  | MessageStruct<BoardCardsMessageType.DELETE_CARD, { cardId: string }>
  | MessageStruct<
      BoardCardsMessageType.TOGGLE_UPVOTE,
      { cardId: string; userId: string }
    >
  | MessageStruct<
      BoardCardsMessageType.ADD_ACTION_ITEM,
      { cardId: string; actionItem: ActionItem }
    >
  | MessageStruct<
      BoardCardsMessageType.UPDATE_ACTION_ITEM,
      { cardId: string; actionItemId: string; patch: Partial<ActionItem> }
    >
  | MessageStruct<BoardCardsMessageType.DELETE_ALL_CARDS, undefined>
  | MessageStruct<BoardCardsMessageType.DELETE_COMPLETED_CARDS, undefined>
  | MessageStruct<
      BoardCardsMessageType.ADD_CARD_COMMENT,
      { cardId: string; newComment: Comment }
    >
  | MessageStruct<
      BoardCardsMessageType.UPDATE_CARD_COMMENT,
      { cardId: string; updatedComment: Comment }
    >
  | MessageStruct<
      BoardCardsMessageType.DELETE_CARD_COMMENT,
      { cardId: string; commentId: string }
    >
  | MessageStruct<
      BoardCardsMessageType.DELETE_ACTION_ITEM,
      { cardId: string; actionItemId: string }
    >

export type CardMessage = { data: CardMessageData }
