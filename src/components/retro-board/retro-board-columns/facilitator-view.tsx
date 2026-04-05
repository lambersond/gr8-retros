'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { Card, CardGroup } from '@/components/card'
import { useAuth } from '@/hooks/use-auth'
import {
  BoardCardsSortOptions,
  type CardGroupState,
  useBoardCards,
} from '@/providers/retro-board/cards'
import { filterCardsBy } from '@/providers/retro-board/cards/utils'
import { useBoardColumns } from '@/providers/retro-board/columns'
import type { Card as CardType } from '@/types'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FacilitatorItem =
  | { kind: 'card'; data: CardType }
  | { kind: 'group'; data: CardGroupState }

type ColumnInfo = {
  label: string
  emoji: string | undefined
  titleBg: string
  titleText: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getItemId(item: FacilitatorItem) {
  return `${item.kind}-${item.data.id}`
}

function isItemDiscussed(
  item: FacilitatorItem,
  cards: Record<string, CardType>,
) {
  if (item.kind === 'card') return item.data.isDiscussed
  const memberCards = item.data.cardIds.map(id => cards[id]).filter(Boolean)
  return memberCards.length > 0 && memberCards.every(c => c.isDiscussed)
}

function getItemSortValues(
  item: FacilitatorItem,
  cards: Record<string, CardType>,
) {
  if (item.kind === 'card') {
    return {
      upvotes: item.data.upvotedBy.length,
      votes: item.data.votes ?? 0,
      actionItemCount: item.data.actionItems.length,
      commentCount: item.data.comments.length,
      newestAt: item.data.createdAt.getTime(),
      oldestAt: item.data.createdAt.getTime(),
    }
  }
  const memberCards = item.data.cardIds.map(id => cards[id]).filter(Boolean)
  return {
    upvotes: memberCards.reduce((sum, c) => sum + c.upvotedBy.length, 0),
    votes: memberCards.reduce((sum, c) => sum + (c.votes ?? 0), 0),
    actionItemCount: memberCards.reduce(
      (sum, c) => sum + c.actionItems.length,
      0,
    ),
    commentCount: memberCards.reduce((sum, c) => sum + c.comments.length, 0),
    newestAt:
      memberCards.length > 0
        ? Math.max(...memberCards.map(c => c.createdAt.getTime()))
        : 0,
    oldestAt:
      memberCards.length > 0
        ? Math.min(...memberCards.map(c => c.createdAt.getTime()))
        : 0,
  }
}

function sortItems(
  items: FacilitatorItem[],
  sort: BoardCardsSortOptions,
  cards: Record<string, CardType>,
) {
  return items.toSorted((a, b) => {
    const aVals = getItemSortValues(a, cards)
    const bVals = getItemSortValues(b, cards)

    let primary = 0
    switch (sort) {
      case BoardCardsSortOptions.BY_UPVOTES: {
        primary = bVals.upvotes - aVals.upvotes
        break
      }
      case BoardCardsSortOptions.BY_VOTES: {
        primary = bVals.votes - aVals.votes
        break
      }
      case BoardCardsSortOptions.BY_ACTION_ITEM_COUNT: {
        primary = bVals.actionItemCount - aVals.actionItemCount
        break
      }
      case BoardCardsSortOptions.BY_COMMENT_COUNT: {
        primary = bVals.commentCount - aVals.commentCount
        break
      }
      case BoardCardsSortOptions.BY_NEWEST: {
        primary = bVals.newestAt - aVals.newestAt
        break
      }
      case BoardCardsSortOptions.BY_OLDEST: {
        primary = aVals.oldestAt - bVals.oldestAt
        break
      }
    }

    if (primary !== 0) return primary
    return aVals.oldestAt - bVals.oldestAt
  })
}

// ---------------------------------------------------------------------------
// Column badge
// ---------------------------------------------------------------------------

function ColumnBadge({
  column,
  columnMap,
}: Readonly<{
  column: string
  columnMap: Record<string, ColumnInfo>
}>) {
  const config = columnMap[column]
  if (!config) return
  return (
    <span
      className='inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full mb-2'
      style={{ backgroundColor: config.titleBg, color: config.titleText }}
    >
      {config.emoji && <span>{config.emoji}</span>}
      {config.label}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Item content (shared between top card & exiting overlay)
// ---------------------------------------------------------------------------

function ItemContent({
  item,
  currentUserId,
}: Readonly<{
  item: FacilitatorItem
  currentUserId?: string
}>) {
  if (item.kind === 'card') {
    return (
      <Card
        id={item.data.id}
        content={item.data.content}
        canEdit={item.data.creatorId === currentUserId}
        upvotes={item.data.upvotedBy.length}
        isUpvoted={item.data.upvotedBy.includes(currentUserId ?? '')}
        column={item.data.column}
        isDiscussed={item.data.isDiscussed}
        createdBy={item.data.createdBy}
        actionItems={item.data.actionItems}
        comments={item.data.comments}
        currentUserId={currentUserId}
      />
    )
  }
  return <CardGroup group={item.data} currentUserId={currentUserId} />
}

// ---------------------------------------------------------------------------
// Stack peek layers (decorative card edges below the top card)
// ---------------------------------------------------------------------------

const STACK_PEEK_LAYERS = [
  { width: '95%', opacity: 0.7 },
  { width: '90%', opacity: 0.4 },
]

function StackPeekLayers({ count }: Readonly<{ count: number }>) {
  if (count <= 0) return
  return (
    <div className='flex flex-col items-center mt-0.5'>
      {STACK_PEEK_LAYERS.slice(
        0,
        Math.min(count, STACK_PEEK_LAYERS.length),
      ).map((layer, i) => (
        <div
          key={i}
          className='h-2 rounded-b-lg bg-card border border-t-0 border-border-light'
          style={{ width: layer.width, opacity: layer.opacity }}
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Exiting overlay (animates the dismissed card off the stack)
// ---------------------------------------------------------------------------

function ExitingOverlay({
  item,
  currentUserId,
  columnMap,
}: Readonly<{
  item: FacilitatorItem
  currentUserId?: string
  columnMap: Record<string, ColumnInfo>
}>) {
  const [started, setStarted] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setStarted(true))
  }, [])

  return (
    <div
      className='absolute inset-x-0 top-0 z-10 pointer-events-none transition-all duration-500 ease-in-out'
      style={{
        opacity: started ? 0 : 1,
        transform: started
          ? 'translateY(-30px) scale(0.97)'
          : 'translateY(0) scale(1)',
      }}
    >
      <ColumnBadge column={item.data.column} columnMap={columnMap} />
      <ItemContent item={item} currentUserId={currentUserId} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Top card (enter animation on mount)
// ---------------------------------------------------------------------------

function TopCard({
  item,
  currentUserId,
  columnMap,
}: Readonly<{
  item: FacilitatorItem
  currentUserId?: string
  columnMap: Record<string, ColumnInfo>
}>) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true))
  }, [])

  return (
    <div
      className='transition-all duration-300 ease-out'
      style={{
        opacity: Number(isVisible),
        transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
      }}
    >
      <ColumnBadge column={item.data.column} columnMap={columnMap} />
      <ItemContent item={item} currentUserId={currentUserId} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main view
// ---------------------------------------------------------------------------

export function FacilitatorView() {
  const { user } = useAuth()
  const boardCards = useBoardCards()
  const { columns } = useBoardColumns()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const [exitingItem, setExitingItem] = useState<FacilitatorItem>()
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
    return sortItems(undiscussed, boardCards.sort, boardCards.cards)
  }, [allItems, boardCards.cards, boardCards.sort])

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
          <div className='text-center text-text-secondary py-8'>
            All cards have been discussed
          </div>
        )}
      </div>
    </div>
  )
}
