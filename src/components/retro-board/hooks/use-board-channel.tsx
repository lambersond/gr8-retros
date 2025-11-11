import { useChannel } from 'ably/react'
import { ACTION_TYPES } from '../constants'
import { useCards } from './use-cards'
import { ActionItem, Card, ColumnType } from '@/types'

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
}

export function useBoardChannel(boardId: string, columnType: ColumnType) {
  const {
    addActionItem,
    addCard,
    deleteCard,
    markDiscussed,
    toggleDoneActionItem,
    toggleUpvote,
    updateActionItem,
    updateCard,
  } = useCards(columnType)
  const { publish } = useChannel({ channelName: boardId }, (message: any) => {
    const { data } = message as Message
    switch (data.type) {
      case ACTION_TYPES.ADD_CARD: {
        const card = data.payload
        isActiveColumn(data.column, columnType, () => {
          addCard(card)
        })
        break
      }
      case ACTION_TYPES.UPDATE_CARD: {
        const { cardId, patch } = data.payload
        isActiveColumn(data.column, columnType, () => {
          updateCard(cardId, { content: patch.content })
        })
        break
      }
      case ACTION_TYPES.DELETE_CARD: {
        const { cardId } = data.payload
        isActiveColumn(data.column, columnType, () => {
          deleteCard(cardId)
        })
        break
      }
      case ACTION_TYPES.TOGGLE_UPVOTE: {
        const { cardId, userId } = data.payload
        isActiveColumn(data.column, columnType, () => {
          toggleUpvote(cardId, userId)
        })
        break
      }
      case ACTION_TYPES.MARK_DISCUSSED: {
        const { cardId, isDiscussed } = data.payload
        isActiveColumn(data.column, columnType, () => {
          markDiscussed(cardId, isDiscussed)
        })
        break
      }
      case ACTION_TYPES.ADD_ACTION_ITEM: {
        const { cardId, actionItem } = data.payload
        isActiveColumn(data.column, columnType, () => {
          addActionItem(cardId, actionItem)
        })
        break
      }
      case ACTION_TYPES.TOGGLE_DONE_ACTION_ITEM: {
        const { cardId, actionItemId, isDone } = data.payload
        isActiveColumn(data.column, columnType, () => {
          toggleDoneActionItem(cardId, actionItemId, isDone)
        })
        break
      }
      case ACTION_TYPES.UPDATE_ACTION_ITEM: {
        const { cardId, actionItemId, patch } = data.payload
        isActiveColumn(data.column, columnType, () => {
          updateActionItem(cardId, actionItemId, { content: patch.content })
        })
        break
      }
      default: {
        break
      }
    }
  })

  return { publish }
}

function isActiveColumn(
  messageColumn: ColumnType,
  currentColumn: ColumnType,
  callback: () => void,
) {
  if (messageColumn === currentColumn) {
    callback()
  }
}
