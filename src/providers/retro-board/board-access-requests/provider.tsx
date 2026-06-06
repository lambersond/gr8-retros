'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useBoardPermissions } from '@/providers/retro-board/board-settings'
import type {
  AccessRequestItem,
  BoardAccessRequestsContextValue,
} from './types'

const Ctx = createContext<BoardAccessRequestsContextValue | undefined>(
  undefined,
)

export function BoardAccessRequestsProvider({
  settingsId,
  children,
}: Readonly<{ settingsId: string; children: React.ReactNode }>) {
  const {
    user: { hasFacilitator },
  } = useBoardPermissions()
  const [pending, setPending] = useState<AccessRequestItem[]>([])
  const [declined, setDeclined] = useState<AccessRequestItem[]>([])

  // Only facilitator+ may read the request list (it carries requester identities).
  const refetch = useCallback(async () => {
    if (!hasFacilitator) {
      setPending([])
      setDeclined([])
      return
    }
    try {
      const res = await fetch(
        `/api/board-settings/${settingsId}/access-request`,
      )
      if (!res.ok) return
      const data = await res.json()
      setPending(data.pending ?? [])
      setDeclined(data.declined ?? [])
    } catch {
      // network errors are non-fatal — the badge simply won't update
    }
  }, [hasFacilitator, settingsId])

  useEffect(() => {
    refetch()
  }, [refetch])

  const value = useMemo(
    () => ({ pending, declined, refetch }),
    [pending, declined, refetch],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useBoardAccessRequests() {
  const ctx = useContext(Ctx)
  if (!ctx) {
    throw new Error(
      'useBoardAccessRequests must be used within a BoardAccessRequestsProvider',
    )
  }
  return ctx
}

// Wired into the message orchestrator so an ACCESS_REQUESTS_CHANGED broadcast
// (request created / approved / rejected from any client) refreshes the list.
export function useBoardAccessRequestsMessageHandlers() {
  const { refetch } = useBoardAccessRequests()
  return useMemo(
    () => ({
      ACCESS_REQUESTS_CHANGED: () => {
        refetch()
      },
    }),
    [refetch],
  )
}
