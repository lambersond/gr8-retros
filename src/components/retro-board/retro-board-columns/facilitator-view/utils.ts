import { BoardCardsSortOptions } from '@/providers/retro-board/cards'
import type { Card } from '@/types'
import type { FacilitatorItem } from './types'

export function getItemId(item: FacilitatorItem) {
  return `${item.kind}-${item.data.id}`
}

export function isItemDiscussed(
  item: FacilitatorItem,
  cards: Record<string, Card>,
) {
  if (item.kind === 'card') return item.data.isDiscussed
  const memberCards = item.data.cardIds.map(id => cards[id]).filter(Boolean)
  return memberCards.length > 0 && memberCards.every(c => c.isDiscussed)
}

function getItemSortValues(item: FacilitatorItem, cards: Record<string, Card>) {
  if (item.kind === 'card') {
    return {
      upvotes: item.data.upvotedBy.length,
      votes: item.data.votes ?? 0,
      actionItemCount: item.data.actionItems?.length ?? 0,
      commentCount: item.data.comments?.length ?? 0,
      newestAt: new Date(item.data.createdAt).getTime(),
      oldestAt: new Date(item.data.createdAt).getTime(),
    }
  }
  const memberCards = item.data.cardIds.map(id => cards[id]).filter(Boolean)
  return {
    upvotes: memberCards.reduce((sum, c) => sum + c.upvotedBy.length, 0),
    votes: (item.data.votes ?? 0) + memberCards.reduce((sum, c) => sum + (c.votes ?? 0), 0),
    actionItemCount: memberCards.reduce(
      (sum, c) => sum + (c.actionItems?.length ?? 0),
      0,
    ),
    commentCount: memberCards.reduce((sum, c) => sum + (c.comments?.length ?? 0), 0),
    newestAt:
      memberCards.length > 0
        ? Math.max(...memberCards.map(c => new Date(c.createdAt).getTime()))
        : 0,
    oldestAt:
      memberCards.length > 0
        ? Math.min(...memberCards.map(c => new Date(c.createdAt).getTime()))
        : 0,
  }
}

export function sortItems(
  items: FacilitatorItem[],
  sort: BoardCardsSortOptions,
  cards: Record<string, Card>,
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
