'use client'

import { createContext, useEffect, useMemo, useState } from 'react'
import { usePresence, usePresenceListener } from 'ably/react'
import { useAuth } from '@/hooks/use-auth'
import type {
  ViewingMembers,
  ViewingMembersContextType,
  ViewingMembersProviderProps,
} from './types'

export const ViewingMembersContext = createContext<
  ViewingMembersContextType | undefined
>(undefined)

export function ViewingMembersProvider({
  channelName,
  children,
}: Readonly<ViewingMembersProviderProps>) {
  const { user, isAuthenticated } = useAuth()

  const [viewingMembers, setViewingMembers] = useState<ViewingMembers>({})

  const presencePayload = useMemo(
    () => ({ name: user.name, image: user.image, isAuthenticated }),
    [user.id, user.name, user.image, isAuthenticated],
  )

  const { updateStatus } = usePresence(channelName, presencePayload)
  const { presenceData } = usePresenceListener(channelName)

  useEffect(() => {
    const members: ViewingMembers = {}
    for (const presence of presenceData) {
      members[presence.clientId] = presence.data
    }
    setViewingMembers(members)
  }, [presenceData])

  useEffect(() => {
    updateStatus(presencePayload)
  }, [presencePayload, updateStatus])

  const contextValue = useMemo(() => ({ viewingMembers }), [viewingMembers])

  return (
    <ViewingMembersContext.Provider value={contextValue}>
      {children}
    </ViewingMembersContext.Provider>
  )
}
