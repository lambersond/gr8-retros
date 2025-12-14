import { useCallback, useEffect, useMemo, useState } from 'react'
import { useChannel, usePresence, usePresenceListener } from 'ably/react'
import { ACTION_TYPES } from '../../constants'
import { useAuth } from '@/hooks/use-auth'
import { useModals } from '@/hooks/use-modals'

type PresenceUser = {
  name: string
  image: string
}

type ViewingMembers = Record<string, PresenceUser>

type PresenceEvent = {
  action: string
  clientId: string
  data: PresenceUser
}

export function useRetroActions(channelName: string) {
  const { user } = useAuth()
  const { openModal } = useModals()

  const { publish } = useChannel({ channelName })

  const [viewingMembers, setViewingMembers] = useState<ViewingMembers>({})

  const presencePayload = useMemo(
    () => ({ name: user.name, image: user.image }),
    [user.name, user.image],
  )

  const { updateStatus } = usePresence(channelName, presencePayload)

  usePresenceListener(channelName, (evt: PresenceEvent) => {
    setViewingMembers(prev => {
      if (evt.action === 'leave') {
        if (!prev[evt.clientId]) return prev
        const next = { ...prev }
        delete next[evt.clientId]
        return next
      }

      // enter/update
      const current = prev[evt.clientId]
      if (
        current?.name === evt.data?.name &&
        current?.image === evt.data?.image
      )
        return prev
      return { ...prev, [evt.clientId]: evt.data }
    })
  })

  useEffect(() => {
    updateStatus(presencePayload)
  }, [presencePayload, updateStatus])

  const deleteThenBroadcast = useCallback(
    async (
      url: string,
      type: (typeof ACTION_TYPES)[keyof typeof ACTION_TYPES],
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
          ACTION_TYPES.DELETE_ALL_CARDS,
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
          ACTION_TYPES.DELETE_COMPLETED_CARDS,
        )
      },
    })
  }, [channelName, confirmAndRun, deleteThenBroadcast])

  return {
    viewingMembers,
    handleClearBoard,
    handleClearCompleted,
  }
}
