import { useCallback } from 'react'
import { useChannel } from 'ably/react'
import { useModals } from '@/hooks/use-modals'
import {
  BoardCardsInternalActionType,
  BoardCardsMessageType,
  BoardCardsSortOptions,
} from '@/providers/retro-board/cards'
import { useBoardCardsDispatch } from '@/providers/retro-board/cards/provider' // temp until we have a decidated board settings provider

export function useRetroActions(channelName: string) {
  const { openModal } = useModals()
  const dispatch = useBoardCardsDispatch()
  const { publish } = useChannel({ channelName })

  const handleSortCardsBy = useCallback(
    (sort: BoardCardsSortOptions) => {
      dispatch({
        type: BoardCardsInternalActionType.SORT_CARDS,
        sort,
      })
    },
    [dispatch],
  )

  const deleteThenBroadcast = useCallback(
    async (url: string, type: BoardCardsMessageType) => {
      try {
        const resp = await fetch(url, {
          method: 'DELETE',
          credentials: 'include',
        })
        if (!resp.ok) return

        publish({ data: { type } })
      } catch {
        console.error('Failed to delete cards')
      }
    },
    [publish],
  )

  const confirmAndRun = useCallback(
    (opts: {
      title: string
      message: string
      submitText: string
      onConfirm: () => void
    }) => {
      openModal('ConfirmModal', {
        title: opts.title,
        color: 'danger',
        message: opts.message,
        onConfirm: opts.onConfirm,
        submitText: opts.submitText,
      })
    },
    [openModal],
  )

  const handleClearBoard = useCallback(() => {
    confirmAndRun({
      title: 'Erase Board Items',
      message: 'Are you sure you want to remove all cards from this board?',
      submitText: 'Yes, clear board',
      onConfirm: () => {
        deleteThenBroadcast(
          `/api/board/${channelName}/cards`,
          BoardCardsMessageType.DELETE_ALL_CARDS,
        )
      },
    })
  }, [channelName, confirmAndRun, deleteThenBroadcast])

  const handleClearCompleted = useCallback(() => {
    confirmAndRun({
      title: 'Clear Completed Items',
      message:
        'This will remove all cards marked discussed and cards with completed action items. Are you sure?',
      submitText: 'Yes, clear completed',
      onConfirm: () => {
        deleteThenBroadcast(
          `/api/board/${channelName}/cards/completed`,
          BoardCardsMessageType.DELETE_COMPLETED_CARDS,
        )
      },
    })
  }, [channelName, confirmAndRun, deleteThenBroadcast])

  return {
    handleClearBoard,
    handleClearCompleted,
    handleSortCardsBy,
  }
}
