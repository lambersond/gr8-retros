import { useEffect, useMemo, useRef, useState } from 'react'
import { usePresence, usePresenceListener } from 'ably/react'
import { useAuth } from '@/hooks/use-auth'
import type { PresenceEvent, ViewingMembers } from './types'

export function useViewingMembers(channelName: string) {
  const { user } = useAuth()
  const havePresenceData = useRef(false)

  const [viewingMembers, setViewingMembers] = useState<ViewingMembers>({})

  const presencePayload = useMemo(
    () => ({ name: user.name, image: user.image }),
    [user.name, user.image],
  )

  const { updateStatus } = usePresence(channelName, presencePayload)

  const { presenceData } = usePresenceListener(
    channelName,
    (evt: PresenceEvent) => {
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
    },
  )

  useEffect(() => {
    if (havePresenceData.current || presenceData.length === 0) return
    havePresenceData.current = true

    const members: ViewingMembers = {}
    for (const presence of presenceData) {
      members[presence.clientId] = presence.data
    }
    setViewingMembers(members)
  }, [presenceData])

  useEffect(() => {
    updateStatus(presencePayload)
  }, [presencePayload, updateStatus])

  return {
    viewingMembers,
  }
}
