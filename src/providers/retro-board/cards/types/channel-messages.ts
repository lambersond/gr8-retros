import type { BoardCardsMessageType, BoardCardsSortOptions } from '../enums'
import type { CardGroupState } from '../types'
import type { ActionItem, Card, Comment, MessageStruct } from '@/types'

export type CardMessageData =
  | MessageStruct<BoardCardsMessageType.ADD_CARD, Card>
  | MessageStruct<
      BoardCardsMessageType.UPDATE_CARD,
      { cardId: string; patch: Partial<Card> }
    >
  | MessageStruct<
      BoardCardsMessageType.UPDATE_CARDS_COLUMN,
      { columnCorrections: { from: string; to: string }[] }
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
  | MessageStruct<
      BoardCardsMessageType.SORT_CARDS,
      { sort: BoardCardsSortOptions }
    >
  | MessageStruct<BoardCardsMessageType.DELETE_ALL_CARDS>
  | MessageStruct<BoardCardsMessageType.DELETE_COMPLETED_CARDS>
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
  | MessageStruct<
      BoardCardsMessageType.CREATE_CARD_GROUP,
      { group: CardGroupState; cardIds: [string, string] }
    >
  | MessageStruct<
      BoardCardsMessageType.ADD_CARD_TO_GROUP,
      { cardId: string; groupId: string }
    >
  | MessageStruct<
      BoardCardsMessageType.REMOVE_CARD_FROM_GROUP,
      { cardId: string; groupId: string; position: number }
    >
  | MessageStruct<
      BoardCardsMessageType.DELETE_CARD_GROUP,
      { groupId: string; restoredCards: { cardId: string; position: number }[] }
    >
  | MessageStruct<
      BoardCardsMessageType.UPDATE_CARD_GROUP,
      { groupId: string; patch: { label?: string } }
    >
  | MessageStruct<
      BoardCardsMessageType.UPDATE_CARD_POSITION,
      { cardId: string; position: number; column: string }
    >
  | MessageStruct<
      BoardCardsMessageType.UPDATE_GROUP_POSITION,
      { groupId: string; position: number; column: string }
    >

export type CardMessage = { data: CardMessageData }
