import { BoardCardsSortOptions } from '../enums'
import { useBoardCards } from '../provider'
import { filterCardsBy } from '../utils'
import type { CardGroupState } from '../types'
import type { Card } from '@/types'

type ColumnItem =
  | { kind: 'card'; data: Card }
  | { kind: 'group'; data: CardGroupState }

function getGroupAggregates(
  group: CardGroupState,
  cards: Record<string, Card>,
) {
  const memberCards = group.cardIds.map(id => cards[id]).filter(Boolean)
  return {
    upvotes: memberCards.reduce((sum, c) => sum + c.upvotedBy.length, 0),
    votes: memberCards.reduce((sum, c) => sum + (c.votes ?? 0), 0),
    actionItemCount: memberCards.reduce(
      (sum, c) => sum + c.actionItems.length,
      0,
    ),
    commentCount: memberCards.reduce((sum, c) => sum + c.comments.length, 0),
    isDiscussed:
      memberCards.length > 0 && memberCards.every(c => c.isDiscussed),
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

function buildComparator(
  sort: BoardCardsSortOptions,
  cards: Record<string, Card>,
) {
  return (a: ColumnItem, b: ColumnItem): number => {
    if (sort === BoardCardsSortOptions.NONE) {
      const posA = a.kind === 'card' ? (a.data.position ?? 0) : a.data.position
      const posB = b.kind === 'card' ? (b.data.position ?? 0) : b.data.position
      return posA - posB
    }

    const getValues = (item: ColumnItem) => {
      if (item.kind === 'card') {
        return {
          upvotes: item.data.upvotedBy.length,
          votes: item.data.votes ?? 0,
          actionItemCount: item.data.actionItems.length,
          commentCount: item.data.comments.length,
          isDiscussed: item.data.isDiscussed,
          newestAt: item.data.createdAt.getTime(),
          oldestAt: item.data.createdAt.getTime(),
        }
      }
      return getGroupAggregates(item.data, cards)
    }

    const aVals = getValues(a)
    const bVals = getValues(b)

    switch (sort) {
      case BoardCardsSortOptions.BY_UPVOTES: {
        return bVals.upvotes - aVals.upvotes
      }
      case BoardCardsSortOptions.BY_VOTES: {
        return bVals.votes - aVals.votes
      }
      case BoardCardsSortOptions.BY_ACTION_ITEM_COUNT: {
        return bVals.actionItemCount - aVals.actionItemCount
      }
      case BoardCardsSortOptions.BY_COMMENT_COUNT: {
        return bVals.commentCount - aVals.commentCount
      }
      case BoardCardsSortOptions.BY_DISCUSSED: {
        if (aVals.isDiscussed === bVals.isDiscussed) return 0
        return aVals.isDiscussed ? 1 : -1
      }
      case BoardCardsSortOptions.BY_NEWEST: {
        return bVals.newestAt - aVals.newestAt
      }
      case BoardCardsSortOptions.BY_OLDEST: {
        return aVals.oldestAt - bVals.oldestAt
      }
      default: {
        return 0
      }
    }
  }
}

export function useColumnItems(column: string): ColumnItem[] {
  const boardCards = useBoardCards()

  const standaloneCards = Object.values(boardCards.cards).filter(
    card => card.column === column && !card.cardGroupId,
  )
  const filteredCards = filterCardsBy(standaloneCards, boardCards.filter)

  const columnGroups = Object.values(boardCards.groups).filter(
    group => group.column === column,
  )

  const items: ColumnItem[] = [
    ...filteredCards.map(card => ({ kind: 'card' as const, data: card })),
    ...columnGroups.map(group => ({ kind: 'group' as const, data: group })),
  ]

  return items.toSorted(buildComparator(boardCards.sort, boardCards.cards))
}
