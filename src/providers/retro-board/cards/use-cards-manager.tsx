import { useCallback, useMemo } from 'react'
import { useChannel } from 'ably/react'
import { useBoardCardsDispatch } from './board-cards-provider'
import { CARD_ACTION } from '@/constants/retro-board'
import type { CardMessage, CardMessageData } from '@/types/retro-board'

export function useCardsManager(boardId: string) {
  const dispatch = useBoardCardsDispatch()

  const handlers = useMemo(() => {
    const h: Partial<Record<CardMessageData['type'], (data: any) => void>> = {
      [CARD_ACTION.ADD_CARD]: data =>
        dispatch({
          type: CARD_ACTION.ADD_CARD,
          column: data.column,
          card: data.payload,
        }),

      [CARD_ACTION.UPDATE_CARD]: data => {
        const { cardId, patch } = data.payload
        dispatch({
          type: CARD_ACTION.UPDATE_CARD,
          column: data.column,
          cardId,
          patch,
        })
      },

      [CARD_ACTION.DELETE_CARD]: data => {
        const { cardId } = data.payload
        dispatch({
          type: CARD_ACTION.DELETE_CARD,
          column: data.column,
          cardId,
        })
      },

      [CARD_ACTION.TOGGLE_UPVOTE]: data => {
        const { cardId, userId } = data.payload
        dispatch({
          type: CARD_ACTION.TOGGLE_UPVOTE,
          column: data.column,
          cardId,
          userId,
        })
      },

      [CARD_ACTION.MARK_DISCUSSED]: data => {
        const { cardId, isDiscussed } = data.payload
        dispatch({
          type: CARD_ACTION.MARK_DISCUSSED,
          column: data.column,
          cardId,
          isDiscussed,
        })
      },

      [CARD_ACTION.ADD_ACTION_ITEM]: data => {
        const { cardId, actionItem } = data.payload
        dispatch({
          type: CARD_ACTION.ADD_ACTION_ITEM,
          column: data.column,
          cardId,
          actionItem,
        })
      },

      [CARD_ACTION.TOGGLE_DONE_ACTION_ITEM]: data => {
        const { cardId, actionItemId, isDone } = data.payload
        dispatch({
          type: CARD_ACTION.TOGGLE_DONE_ACTION_ITEM,
          column: data.column,
          cardId,
          actionItemId,
          isDone,
        })
      },

      [CARD_ACTION.UPDATE_ACTION_ITEM]: data => {
        const { cardId, actionItemId, patch } = data.payload
        dispatch({
          type: CARD_ACTION.UPDATE_ACTION_ITEM,
          column: data.column,
          cardId,
          actionItemId,
          patch,
        })
      },

      [CARD_ACTION.DELETE_ALL_CARDS]: () =>
        dispatch({ type: CARD_ACTION.DELETE_ALL_CARDS }),

      [CARD_ACTION.DELETE_COMPLETED_CARDS]: () =>
        dispatch({ type: CARD_ACTION.DELETE_COMPLETED_CARDS }),

      [CARD_ACTION.ADD_CARD_COMMENT]: data =>
        dispatch({
          type: CARD_ACTION.ADD_CARD_COMMENT,
          column: data.payload.column,
          newComment: data.payload.newComment,
        }),

      [CARD_ACTION.UPDATE_CARD_COMMENT]: data =>
        dispatch({
          type: CARD_ACTION.UPDATE_CARD_COMMENT,
          column: data.payload.column,
          updatedComment: data.payload.updatedComment,
        }),

      [CARD_ACTION.DELETE_CARD_COMMENT]: data => {
        const { cardId, commentId } = data.payload
        dispatch({
          type: CARD_ACTION.DELETE_CARD_COMMENT,
          column: data.payload.column,
          cardId,
          commentId,
        })
      },
    }

    return h as Record<CardMessageData['type'], (data: CardMessageData) => void>
  }, [dispatch])

  const onMessage = useCallback(
    (message: unknown) => {
      const { data } = message as CardMessage
      const handler = handlers[data.type]
      handler?.(data)
    },
    [handlers],
  )

  useChannel({ channelName: boardId }, onMessage)
}
