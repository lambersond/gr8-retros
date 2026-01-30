import { useMemo } from 'react'
import { BoardCardsMessageType } from '../enums'
import { useBoardCardsDispatch } from '../provider'

export function useBoardCardsMessageHandlers() {
  const dispatch = useBoardCardsDispatch()

  const handlers = useMemo(() => {
    const h: Record<BoardCardsMessageType, (data: any, name?: string) => void> =
      {
        [BoardCardsMessageType.ADD_CARD]: data =>
          dispatch({
            type: BoardCardsMessageType.ADD_CARD,
            card: data.payload,
          }),

        [BoardCardsMessageType.UPDATE_CARD]: data => {
          const { cardId, patch } = data.payload
          dispatch({
            type: BoardCardsMessageType.UPDATE_CARD,
            cardId,
            patch,
          })
        },

        [BoardCardsMessageType.DELETE_CARD]: data => {
          const { cardId } = data.payload
          dispatch({
            type: BoardCardsMessageType.DELETE_CARD,
            cardId,
          })
        },

        [BoardCardsMessageType.TOGGLE_UPVOTE]: data => {
          const { cardId, userId } = data.payload
          dispatch({
            type: BoardCardsMessageType.TOGGLE_UPVOTE,
            cardId,
            userId,
          })
        },

        [BoardCardsMessageType.ADD_ACTION_ITEM]: data => {
          const { cardId, actionItem } = data.payload
          dispatch({
            type: BoardCardsMessageType.ADD_ACTION_ITEM,
            cardId,
            actionItem,
          })
        },

        [BoardCardsMessageType.UPDATE_ACTION_ITEM]: data => {
          const { cardId, actionItemId, patch } = data.payload
          dispatch({
            type: BoardCardsMessageType.UPDATE_ACTION_ITEM,
            cardId,
            actionItemId,
            patch,
          })
        },

        [BoardCardsMessageType.DELETE_ACTION_ITEM]: data => {
          const { cardId, actionItemId } = data.payload
          dispatch({
            type: BoardCardsMessageType.DELETE_ACTION_ITEM,
            cardId,
            actionItemId,
          })
        },

        [BoardCardsMessageType.DELETE_ALL_CARDS]: () =>
          dispatch({ type: BoardCardsMessageType.DELETE_ALL_CARDS }),

        [BoardCardsMessageType.DELETE_COMPLETED_CARDS]: () =>
          dispatch({ type: BoardCardsMessageType.DELETE_COMPLETED_CARDS }),

        [BoardCardsMessageType.ADD_CARD_COMMENT]: data =>
          dispatch({
            type: BoardCardsMessageType.ADD_CARD_COMMENT,
            cardId: data.payload.newComment.cardId,
            comment: data.payload.newComment,
          }),

        [BoardCardsMessageType.UPDATE_CARD_COMMENT]: data =>
          dispatch({
            type: BoardCardsMessageType.UPDATE_CARD_COMMENT,
            cardId: data.payload.updatedComment.cardId,
            patch: data.payload.updatedComment,
          }),

        [BoardCardsMessageType.DELETE_CARD_COMMENT]: data => {
          const { cardId, commentId } = data.payload
          dispatch({
            type: BoardCardsMessageType.DELETE_CARD_COMMENT,
            cardId,
            commentId,
          })
        },
      }

    return h
  }, [dispatch])

  return handlers
}
