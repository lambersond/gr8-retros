'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useChannel } from 'ably/react'
import { CircleCheckBig, LogOut, SkipForward } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useTheme } from 'next-themes'
import { ExitingOverlay } from './exiting-overlay'
import { StackPeekLayers } from './stack-peek-layers'
import { TopCard } from './top-card'
import { getItemId, isItemDiscussed, sortItems } from './utils'
import { useAuth } from '@/hooks/use-auth'
import {
  useBoardCards,
  BoardCardsMessageType,
} from '@/providers/retro-board/cards'
import { filterCardsBy } from '@/providers/retro-board/cards/utils'
import { useBoardColumns } from '@/providers/retro-board/columns'
import {
  useBoardControlsActions,
  useBoardControlsState,
} from '@/providers/retro-board/controls'
import type { ColumnInfo, FacilitatorItem } from './types'

export function FacilitatorView() {
  const { user } = useAuth()
  const boardCards = useBoardCards()
  const { columns } = useBoardColumns()
  const { id } = useParams() satisfies { id: string }
  const { publish } = useChannel(id)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const [exitingItem, setExitingItem] = useState<FacilitatorItem>()
  const skippedIdsArray = useBoardControlsState(
    s => s.boardControls.facilitatorMode.skippedIds ?? [],
  )
  const { updateBoardControls, toggleFacilitatorMode, resetVoting } =
    useBoardControlsActions(a => ({
      updateBoardControls: a.updateBoardControls,
      toggleFacilitatorMode: a.toggleFacilitatorMode,
      resetVoting: a.resetVoting,
    }))

  const handleEndFacilitation = useCallback(() => {
    resetVoting()
    toggleFacilitatorMode()
  }, [resetVoting, toggleFacilitatorMode])
  const prevTopIdRef = useRef<string | undefined>(undefined)

  const columnMap = useMemo(() => {
    const map: Record<string, ColumnInfo> = {}
    for (const col of columns) {
      map[col.columnType] = {
        label: col.label,
        emoji: col.emoji ?? undefined,
        titleBg: isDark ? col.darkTitleBg : col.lightTitleBg,
        titleText: isDark ? col.darkTitleText : col.lightTitleText,
      }
    }
    return map
  }, [columns, isDark])

  const allItems = useMemo<FacilitatorItem[]>(() => {
    const standaloneCards = Object.values(boardCards.cards).filter(
      card => !card.cardGroupId,
    )
    const filteredCards = filterCardsBy(standaloneCards, boardCards.filter)
    const allGroups = Object.values(boardCards.groups)

    return [
      ...filteredCards.map(card => ({ kind: 'card' as const, data: card })),
      ...allGroups.map(group => ({ kind: 'group' as const, data: group })),
    ]
  }, [boardCards.cards, boardCards.groups, boardCards.filter])

  const sorted = useMemo(() => {
    const undiscussed = allItems.filter(
      item => !isItemDiscussed(item, boardCards.cards),
    )
    const base = sortItems(undiscussed, boardCards.sort, boardCards.cards)
    if (skippedIdsArray.length === 0) return base
    const skippedSet = new Set(skippedIdsArray)
    // Skipped items are removed from the queue entirely; once every item has
    // been skipped (or discussed) the end-of-facilitation view is shown.
    return base.filter(item => !skippedSet.has(getItemId(item)))
  }, [allItems, boardCards.cards, boardCards.sort, skippedIdsArray])

  // Detect when the top card is discussed for exit animation
  useEffect(() => {
    const topId = sorted.length > 0 ? getItemId(sorted[0]) : undefined
    const prevId = prevTopIdRef.current

    if (prevId && prevId !== topId) {
      const prevItem = allItems.find(item => getItemId(item) === prevId)
      if (prevItem && isItemDiscussed(prevItem, boardCards.cards)) {
        const exitId = getItemId(prevItem)
        setExitingItem(prevItem)
        setTimeout(() => {
          setExitingItem(prev =>
            prev && getItemId(prev) === exitId ? undefined : prev,
          )
        }, 500)
      }
    }

    prevTopIdRef.current = topId
  }, [sorted, allItems, boardCards.cards])

  const topItem = sorted[0]
  const remainingCount = Math.max(0, sorted.length - 1)

  const handleMarkDiscussed = useCallback(async () => {
    if (!topItem) return
    const cardIds =
      topItem.kind === 'card' ? [topItem.data.id] : topItem.data.cardIds
    await Promise.all(
      cardIds.map(cardId =>
        fetch('/api/card/discussed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ cardId, isDiscussed: true }),
        }).then(resp => {
          if (resp.ok) {
            publish({
              data: {
                type: BoardCardsMessageType.UPDATE_CARD,
                payload: { cardId, patch: { isDiscussed: true } },
              },
            })
          }
        }),
      ),
    )
  }, [topItem, publish])

  const handleSkip = useCallback(() => {
    if (!topItem) return
    const itemId = getItemId(topItem)
    const newSkippedIds = [
      ...skippedIdsArray.filter(id => id !== itemId),
      itemId,
    ]
    updateBoardControls({
      facilitatorMode: {
        isActive: true,
        skippedIds: newSkippedIds,
      },
    })
  }, [topItem, skippedIdsArray, updateBoardControls])

  return (
    <div className='flex-1 min-h-0 overflow-hidden flex flex-col items-center justify-start py-6 px-3'>
      <div className='w-full max-w-lg relative'>
        {exitingItem && (
          <ExitingOverlay
            key={getItemId(exitingItem)}
            item={exitingItem}
            currentUserId={user?.id}
            columnMap={columnMap}
          />
        )}
        {topItem && (
          <>
            <div className='mb-3 mx-auto flex items-center justify-center gap-2'>
              <button
                onClick={handleMarkDiscussed}
                className='flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-text-secondary border border-border-light hover:bg-hover transition-colors cursor-pointer'
              >
                <CircleCheckBig className='size-3.5' />
                Mark Discussed
              </button>
              <button
                onClick={handleSkip}
                className='flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-text-secondary border border-border-light hover:bg-hover transition-colors cursor-pointer'
              >
                <SkipForward className='size-3.5' />
                Skip
              </button>
            </div>
            <TopCard
              key={getItemId(topItem)}
              item={topItem}
              currentUserId={user?.id}
              columnMap={columnMap}
            />
            <StackPeekLayers count={remainingCount} />
            {remainingCount > 0 && (
              <p className='text-center text-sm text-text-secondary mt-4'>
                {remainingCount} more to discuss
              </p>
            )}
          </>
        )}
        {!topItem && !exitingItem && (
          <div className='flex flex-col items-center gap-4 py-8'>
            <p className='text-center text-text-secondary'>
              All cards have been discussed
            </p>
            <button
              onClick={handleEndFacilitation}
              className='flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-text-secondary border border-border-light hover:bg-hover transition-colors cursor-pointer'
            >
              <LogOut className='size-3.5' />
              End Facilitation
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
