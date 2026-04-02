import type {
  BoardCardsFilterOptions,
  BoardCardsInternalActionType,
  BoardCardsMessageType,
  BoardCardsSortOptions,
} from '../enums'
import type { BoardCardsState, CardGroupState } from './provider'
import type { ActionItem, Board, Card, Comment } from '@/types'

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
      type: BoardCardsMessageType.UPDATE_CARDS_COLUMN
      columnCorrections: { from: string; to: string }[]
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
      type: BoardCardsMessageType.SORT_CARDS
      sort: BoardCardsSortOptions
    }
  | {
      type: BoardCardsMessageType.CREATE_CARD_GROUP
      group: CardGroupState
      cardIds: [string, string]
    }
  | {
      type: BoardCardsMessageType.ADD_CARD_TO_GROUP
      cardId: string
      groupId: string
    }
  | {
      type: BoardCardsMessageType.REMOVE_CARD_FROM_GROUP
      cardId: string
      groupId: string
      position: number
    }
  | {
      type: BoardCardsMessageType.DELETE_CARD_GROUP
      groupId: string
      restoredCards: { cardId: string; position: number }[]
    }
  | {
      type: BoardCardsMessageType.UPDATE_CARD_POSITION
      cardId: string
      position: number
      column: string
    }
  | {
      type: BoardCardsMessageType.UPDATE_CARD_GROUP
      groupId: string
      patch: { label?: string }
    }
  | {
      type: BoardCardsMessageType.UPDATE_GROUP_POSITION
      groupId: string
      position: number
      column: string
    }
  | {
      type: BoardCardsInternalActionType.FILTER_CARDS
      filter: BoardCardsFilterOptions
    }
  | {
      type: BoardCardsInternalActionType.CLOSE_VOTING_RESULTS
      votingResults: Record<string, string[]>
    }
  | {
      type: BoardCardsInternalActionType.RESET_VOTING_RESULTS
    }
  | {
      type: BoardCardsInternalActionType.RESYNC_CARDS
      board: Board
    }
