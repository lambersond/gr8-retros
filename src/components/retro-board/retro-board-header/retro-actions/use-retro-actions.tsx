import { useCallback } from 'react'
import { useChannel } from 'ably/react'
import { CARD_ACTION } from '@/constants/retro-board'
import { useModals } from '@/hooks/use-modals'
import { useBoardCardsDispatch } from '@/providers/retro-board/cards/board-cards-provider' // temp until we have a decidated board settings provider

export function useRetroActions(channelName: string) {
  const { openModal } = useModals()
  const dispatch = useBoardCardsDispatch()

  const handleSortCardsBy = useCallback(
    (sort: any) => {
      dispatch({
        type: CARD_ACTION.SORT_CARDS,
        sort,
      })
    },
    [dispatch],
  )

  const { publish } = useChannel({ channelName })

  const deleteThenBroadcast = useCallback(
    async (
      url: string,
      type: (typeof CARD_ACTION)[keyof typeof CARD_ACTION],
    ) => {
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
          CARD_ACTION.DELETE_ALL_CARDS,
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
          CARD_ACTION.DELETE_COMPLETED_CARDS,
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
