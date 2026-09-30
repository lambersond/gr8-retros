'use client'

import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import type { ChangelogUpdate } from '@/server/sleekplan'

// Per-viewer "seen" state lives in localStorage (the Sleekplan API key is
// product-level and exposes no per-user/per-entry viewed state to read). An
// entry is "unviewed" until its id is stored. This provider is the single source
// of truth so the app-bar avatar/popover and the /me list stay in sync.
const STORAGE_KEY = 'changelog:viewed'

interface ChangelogContextValue {
  entries: ChangelogUpdate[]
  ready: boolean
  unviewedCount: number
  isUnviewed: (id: number) => boolean
  markViewed: (id: number) => void
  markAllViewed: () => void
}

export const ChangelogContext = createContext<
  ChangelogContextValue | undefined
>(undefined)

function loadViewed(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const ids = raw ? (JSON.parse(raw) as unknown) : []
    return new Set(Array.isArray(ids) ? (ids as number[]) : [])
  } catch {
    return new Set()
  }
}

function persistViewed(ids: Set<number>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
  } catch {
    // Storage unavailable (private mode / disabled) — dots just won't persist.
  }
}

export function ChangelogProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isAuthenticated } = useAuth()
  const [entries, setEntries] = useState<ChangelogUpdate[]>([])
  const [viewed, setViewed] = useState<Set<number>>(() => new Set())
  const [ready, setReady] = useState(false)

  // Load persisted viewed ids once on the client.
  useEffect(() => {
    setViewed(loadViewed())
  }, [])

  // Fetch entries (the server route holds the Sleekplan key) once signed in.
  useEffect(() => {
    if (!isAuthenticated) {
      setEntries([])
      setReady(false)
      return
    }

    let active = true
    fetch('/api/changelog')
      .then(res => (res.ok ? res.json() : { items: [] }))
      .then((data: { items?: ChangelogUpdate[] }) => {
        if (active) setEntries(data.items ?? [])
      })
      .catch(() => {
        if (active) setEntries([])
      })
      .finally(() => {
        if (active) setReady(true)
      })

    return () => {
      active = false
    }
  }, [isAuthenticated])

  const markViewed = useCallback((id: number) => {
    setViewed(prev => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      persistViewed(next)
      return next
    })
  }, [])

  const markAllViewed = useCallback(() => {
    setViewed(prev => {
      const next = new Set(prev)
      let changed = false
      for (const entry of entries) {
        if (!next.has(entry.id)) {
          next.add(entry.id)
          changed = true
        }
      }
      if (!changed) return prev
      persistViewed(next)
      return next
    })
  }, [entries])

  const value = useMemo<ChangelogContextValue>(() => {
    const unviewedCount = ready
      ? entries.reduce((sum, entry) => sum + (viewed.has(entry.id) ? 0 : 1), 0)
      : 0
    return {
      entries,
      ready,
      unviewedCount,
      isUnviewed: (id: number) => ready && !viewed.has(id),
      markViewed,
      markAllViewed,
    }
  }, [entries, ready, viewed, markViewed, markAllViewed])

  return (
    <ChangelogContext.Provider value={value}>
      {children}
    </ChangelogContext.Provider>
  )
}
