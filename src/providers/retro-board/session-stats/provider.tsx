'use client'

import { createContext, useCallback, useEffect, useMemo, useRef } from 'react'
import {
  isItemDiscussed,
  sortItems,
} from '@/components/retro-board/retro-board-columns/facilitator-view/utils'
import { useBoardCards } from '@/providers/retro-board/cards'
import { filterCardsBy } from '@/providers/retro-board/cards/utils'
import { useBoardControlsState } from '@/providers/retro-board/controls'
import { useViewingMembers } from '@/providers/viewing-members'
import type {
  DiscussionTiming,
  PersistedSessionStats,
  SessionParticipant,
  SessionStatsContextType,
} from './types'
import type { FacilitatorItem } from '@/components/retro-board/retro-board-columns/facilitator-view/types'

const TWO_HOURS_MS = 2 * 60 * 60 * 1000
const SAVE_INTERVAL_MS = 30_000

function getStorageKey(boardId: string) {
  return `session-stats:${boardId}`
}

function loadSession(boardId: string): PersistedSessionStats | undefined {
  try {
    const raw = localStorage.getItem(getStorageKey(boardId))
    if (!raw) return undefined
    const parsed = JSON.parse(raw) as PersistedSessionStats
    if (parsed.boardId !== boardId) return undefined
    if (Date.now() - parsed.lastSavedAt > TWO_HOURS_MS) return undefined
    return parsed
  } catch {
    return undefined
  }
}

function saveSession(stats: PersistedSessionStats) {
  try {
    localStorage.setItem(
      getStorageKey(stats.boardId),
      JSON.stringify({ ...stats, lastSavedAt: Date.now() }),
    )
  } catch {
    // localStorage full or unavailable
  }
}

export const SessionStatsContext = createContext<
  SessionStatsContextType | undefined
>(undefined)

export function SessionStatsProvider({
  boardId,
  children,
}: Readonly<{ boardId: string; children: React.ReactNode }>) {
  const boardCards = useBoardCards()
  const { viewingMembers } = useViewingMembers()
  const isFacilitatorActive = useBoardControlsState(
    s => s.boardControls.facilitatorMode.isActive,
  )

  // Persistent refs — survive re-renders without causing them
  const participantsRef = useRef<Map<string, SessionParticipant>>(new Map())
  const timingsRef = useRef<Record<string, DiscussionTiming>>({})
  const sessionStartRef = useRef(Date.now())
  const currentItemRef = useRef<string | undefined>(undefined)
  const currentItemStartRef = useRef<number | undefined>(undefined)

  // Initialize from localStorage on mount
  const initializedRef = useRef(false)
  if (!initializedRef.current) {
    initializedRef.current = true
    const existing = loadSession(boardId)
    if (existing) {
      sessionStartRef.current = existing.sessionStartedAt
      timingsRef.current = existing.discussionTimings
      for (const p of existing.participants) {
        participantsRef.current.set(p.name, p)
      }
    }
  }

  // Accumulate viewing members into participants
  useEffect(() => {
    for (const member of Object.values(viewingMembers)) {
      if (member.name && !participantsRef.current.has(member.name)) {
        participantsRef.current.set(member.name, {
          name: member.name,
          image: member.image ?? undefined,
        })
      }
    }
  }, [viewingMembers])

  // Compute the current top facilitator item (same logic as FacilitatorView)
  const topItemId = useMemo(() => {
    if (!isFacilitatorActive) return

    const standaloneCards = Object.values(boardCards.cards).filter(
      card => !card.cardGroupId,
    )
    const filteredCards = filterCardsBy(standaloneCards, boardCards.filter)
    const allGroups = Object.values(boardCards.groups)

    const allItems: FacilitatorItem[] = [
      ...filteredCards.map(card => ({ kind: 'card' as const, data: card })),
      ...allGroups.map(group => ({ kind: 'group' as const, data: group })),
    ]

    const undiscussed = allItems.filter(
      item => !isItemDiscussed(item, boardCards.cards),
    )
    const sorted = sortItems(undiscussed, boardCards.sort, boardCards.cards)
    if (sorted.length === 0) return

    const top = sorted[0]
    return `${top.kind}-${top.data.id}`
  }, [isFacilitatorActive, boardCards])

  // Helper to get item label + column for timing records
  const getItemMeta = useCallback(
    (
      itemId: string,
    ): { label: string; column: string; kind: 'card' | 'group' } => {
      const dashIdx = itemId.indexOf('-')
      const kind = itemId.slice(0, dashIdx) as 'card' | 'group'
      const id = itemId.slice(dashIdx + 1)

      if (kind === 'card') {
        const card = boardCards.cards[id]
        return {
          label: card?.content ?? 'Unknown card',
          column: card?.column ?? '',
          kind,
        }
      }
      const group = boardCards.groups[id]
      return {
        label: group?.label ?? 'Unknown group',
        column: group?.column ?? '',
        kind,
      }
    },
    [boardCards.cards, boardCards.groups],
  )

  // Flush elapsed time for a given item into the timings map
  const flushElapsed = useCallback(
    (itemId: string, elapsed: number) => {
      const existing = timingsRef.current[itemId]
      if (existing) {
        existing.durationMs += elapsed
      } else {
        const meta = getItemMeta(itemId)
        timingsRef.current[itemId] = {
          itemId,
          itemKind: meta.kind,
          label: meta.label,
          column: meta.column,
          durationMs: elapsed,
        }
      }
    },
    [getItemMeta],
  )

  // Track discussion timing when top item changes
  useEffect(() => {
    const prevId = currentItemRef.current
    const now = Date.now()

    if (prevId && currentItemStartRef.current) {
      flushElapsed(prevId, now - currentItemStartRef.current)
    }

    currentItemRef.current = topItemId
    currentItemStartRef.current = topItemId ? now : undefined
  }, [topItemId, flushElapsed])

  // Save to localStorage every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const currentId = currentItemRef.current
      const now = Date.now()
      if (currentId && currentItemStartRef.current) {
        flushElapsed(currentId, now - currentItemStartRef.current)
        currentItemStartRef.current = now
      }

      saveSession({
        boardId,
        sessionStartedAt: sessionStartRef.current,
        lastSavedAt: Date.now(),
        participants: [...participantsRef.current.values()],
        discussionTimings: timingsRef.current,
      })
    }, SAVE_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [boardId, flushElapsed])

  // Save on unmount
  useEffect(() => {
    return () => {
      saveSession({
        boardId,
        sessionStartedAt: sessionStartRef.current,
        lastSavedAt: Date.now(),
        participants: [...participantsRef.current.values()],
        discussionTimings: timingsRef.current,
      })
    }
  }, [boardId])

  const contextValue = useMemo<SessionStatsContextType>(
    () => ({
      sessionStartedAt: sessionStartRef.current,
      participants: [...participantsRef.current.values()],
      discussionTimings: { ...timingsRef.current },
    }),
    // Re-derive when board data changes so export always has fresh values
    [boardCards, viewingMembers, topItemId],
  )

  return (
    <SessionStatsContext.Provider value={contextValue}>
      {children}
    </SessionStatsContext.Provider>
  )
}
