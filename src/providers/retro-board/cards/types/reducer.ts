import type {
  BoardCardsInternalActionType,
  BoardCardsMessageType,
  BoardCardsSortOptions,
} from '../enums'
import type { BoardCardsState } from './provider'
import type { ActionItem, Card, Comment } from '@/types'

export type ActionHandler<
  A extends BoardCardsReducerAction = BoardCardsReducerAction,
> = (state: BoardCardsState, action: A) => BoardCardsState

export type BoardCardsReducerAction =
  | {
      type: BoardCardsMessageType.ADD_CARD
      card: Card
    }
  | {
      type: BoardCardsMessageType.UPDATE_CARD
      cardId: string
      patch: Partial<Card>
    }
  | {
      type: BoardCardsMessageType.DELETE_CARD
      cardId: string
    }
  | {
      type: BoardCardsMessageType.DELETE_ALL_CARDS
    }
  | {
      type: BoardCardsMessageType.DELETE_COMPLETED_CARDS
    }
  | {
      type: BoardCardsMessageType.TOGGLE_UPVOTE
      cardId: string
      userId: string
    }
  | {
      type: BoardCardsMessageType.ADD_ACTION_ITEM
      cardId: string
      actionItem: ActionItem
    }
  | {
      type: BoardCardsMessageType.UPDATE_ACTION_ITEM
      cardId: string
      actionItemId: string
      patch: Partial<ActionItem>
    }
  | {
      type: BoardCardsMessageType.DELETE_ACTION_ITEM
      cardId: string
      actionItemId: string
    }
  | {
      type: BoardCardsMessageType.ADD_CARD_COMMENT
      cardId: string
      comment: Comment
    }
  | {
      type: BoardCardsMessageType.UPDATE_CARD_COMMENT
      cardId: string
      patch: Partial<Comment>
    }
  | {
      type: BoardCardsMessageType.DELETE_CARD_COMMENT
      cardId: string
      commentId: string
    }
  | {
      type: BoardCardsInternalActionType.SORT_CARDS
      sort: BoardCardsSortOptions
    }
