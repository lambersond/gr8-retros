import { useChannel } from 'ably/react'
import { ACTION_TYPES } from '../constants'
import { useRetroBoardDispatch } from '../provider/retro-board-provider'
import { ActionItem, Card, Comment, ColumnType } from '@/types'

type Message = {
  data:
    | {
        type: typeof ACTION_TYPES.ADD_CARD
        column: ColumnType
        payload: Card
      }
    | {
        type: typeof ACTION_TYPES.UPDATE_CARD
        column: ColumnType
        payload: {
          cardId: string
          column: ColumnType
          patch: Partial<Card>
        }
      }
    | {
        type: typeof ACTION_TYPES.DELETE_CARD
        column: ColumnType
        payload: {
          cardId: string
        }
      }
    | {
        type: typeof ACTION_TYPES.TOGGLE_UPVOTE
        column: ColumnType
        payload: {
          cardId: string
          userId: string
        }
      }
    | {
        type: typeof ACTION_TYPES.MARK_DISCUSSED
        column: ColumnType
        payload: {
          cardId: string
          isDiscussed: boolean
        }
      }
    | {
        type: typeof ACTION_TYPES.ADD_ACTION_ITEM
        column: ColumnType
        payload: {
          cardId: string
          actionItem: ActionItem
        }
      }
    | {
        type: typeof ACTION_TYPES.TOGGLE_DONE_ACTION_ITEM
        column: ColumnType
        payload: {
          cardId: string
          actionItemId: string
          isDone: boolean
        }
      }
    | {
        type: typeof ACTION_TYPES.UPDATE_ACTION_ITEM
        column: ColumnType
        payload: {
          cardId: string
          actionItemId: string
          patch: Partial<ActionItem>
        }
      }
    | {
        type: typeof ACTION_TYPES.DELETE_ALL_CARDS
        column: never
      }
    | {
        type: typeof ACTION_TYPES.DELETE_COMPLETED_CARDS
        column: never
      }
    | {
        type: typeof ACTION_TYPES.ADD_CARD_COMMENT
        column: ColumnType
        payload: {
          column: ColumnType
          newComment: Comment
        }
      }
    | {
        type: typeof ACTION_TYPES.UPDATE_CARD_COMMENT
        column: ColumnType
        payload: {
          column: ColumnType
          cardId: string
          updatedComment: Comment
        }
      }
    | {
        type: typeof ACTION_TYPES.DELETE_CARD_COMMENT
        column: ColumnType
        payload: {
          column: ColumnType
          cardId: string
          commentId: string
        }
      }
}

export function useMessageManager(boardId: string) {
  const dispatch = useRetroBoardDispatch()

  useChannel({ channelName: boardId }, (message: any) => {
    const { data } = message as Message
    const { column } = data
    switch (data.type) {
      case ACTION_TYPES.ADD_CARD: {
        const card = data.payload
        dispatch({ type: ACTION_TYPES.ADD_CARD, column, card })
        break
      }
      case ACTION_TYPES.UPDATE_CARD: {
        const { cardId, patch } = data.payload
        dispatch({ type: ACTION_TYPES.UPDATE_CARD, column, cardId, patch })
        break
      }
      case ACTION_TYPES.DELETE_CARD: {
        const { cardId } = data.payload
        dispatch({ type: ACTION_TYPES.DELETE_CARD, column, cardId })
        break
      }
      case ACTION_TYPES.TOGGLE_UPVOTE: {
        const { cardId, userId } = data.payload
        dispatch({
          type: ACTION_TYPES.TOGGLE_UPVOTE,
          column: data.column,
          cardId,
          userId,
        })
        break
      }
      case ACTION_TYPES.MARK_DISCUSSED: {
        const { cardId, isDiscussed } = data.payload
        dispatch({
          type: ACTION_TYPES.MARK_DISCUSSED,
          column,
          cardId,
          isDiscussed,
        })
        break
      }
      case ACTION_TYPES.ADD_ACTION_ITEM: {
        const { cardId, actionItem } = data.payload
        dispatch({
          type: ACTION_TYPES.ADD_ACTION_ITEM,
          column,
          cardId,
          actionItem,
        })
        break
      }
      case ACTION_TYPES.TOGGLE_DONE_ACTION_ITEM: {
        const { cardId, actionItemId, isDone } = data.payload
        dispatch({
          type: ACTION_TYPES.TOGGLE_DONE_ACTION_ITEM,
          column,
          cardId,
          actionItemId,
          isDone,
        })
        break
      }
      case ACTION_TYPES.UPDATE_ACTION_ITEM: {
        const { cardId, actionItemId, patch } = data.payload
        dispatch({
          type: ACTION_TYPES.UPDATE_ACTION_ITEM,
          column,
          cardId,
          actionItemId,
          patch,
        })
        break
      }
      case ACTION_TYPES.DELETE_ALL_CARDS: {
        dispatch({ type: ACTION_TYPES.DELETE_ALL_CARDS })
        break
      }
      case ACTION_TYPES.DELETE_COMPLETED_CARDS: {
        dispatch({ type: ACTION_TYPES.DELETE_COMPLETED_CARDS })
        break
      }
      case ACTION_TYPES.ADD_CARD_COMMENT: {
        const { column, newComment } = data.payload
        dispatch({
          type: ACTION_TYPES.ADD_CARD_COMMENT,
          column,
          newComment,
        })
        break
      }
      case ACTION_TYPES.UPDATE_CARD_COMMENT: {
        const { column, updatedComment } = data.payload
        dispatch({
          type: ACTION_TYPES.UPDATE_CARD_COMMENT,
          column,
          updatedComment,
        })
        break
      }
      case ACTION_TYPES.DELETE_CARD_COMMENT: {
        const { column, cardId, commentId } = data.payload
        dispatch({
          type: ACTION_TYPES.DELETE_CARD_COMMENT,
          column,
          cardId,
          commentId,
        })
        break
      }
      default: {
        break
      }
    }
  })
}
