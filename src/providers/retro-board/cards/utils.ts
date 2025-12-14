import { COLUMN_TYPES } from '@/constants'
import type { ColumnState, CardsState } from './types'
import type { Board, Card, ColumnType } from '@/types'

export function toColumnType(column: string): ColumnType | undefined {
  return COLUMN_TYPES.includes(column as ColumnType)
    ? (column as ColumnType)
    : undefined
}

export function sortCards(cards: Card[]): Card[] {
  return cards.toSorted((a, b) => {
    // First sort by !isDiscussed (not discussed cards come first)
    if (a.isDiscussed !== b.isDiscussed) {
      return a.isDiscussed ? 1 : -1
    }

    // Then sort by upvotes (descending)
    if (a.upvotedBy.length !== b.upvotedBy.length) {
      return b.upvotedBy.length - a.upvotedBy.length
    }

    // Finally sort by createdAt (ascending)
    const aDate = new Date(a.createdAt)
    const bDate = new Date(b.createdAt)
    return aDate.getTime() - bDate.getTime()
  })
}

export function createInitialState(board: Board) {
  const base: CardsState = {
    GOOD: { cards: [] },
    MEH: { cards: [] },
    BAD: { cards: [] },
    SHOUTOUT: { cards: [] },
  }

  for (const card of board.cards) {
    const col = toColumnType(card.column)
    if (!col) continue
    base[col].cards.push(card)
  }

  for (const col of COLUMN_TYPES) {
    base[col].cards = sortCards(base[col].cards)
  }

  return base
}

export function updateCardInColumn(
  columnState: ColumnState,
  cardId: string,
  updater: (card: Card) => Card,
): ColumnState {
  return {
    cards: columnState.cards.map(c => (c.id === cardId ? updater(c) : c)),
  }
}

export function filterCompletedCards(cards: Card[]) {
  return cards.filter(
    card => !card.isDiscussed || card.actionItems.some(item => !item.isDone),
  )
}

export function sortCardsBy(cards: Card[], sort: any) {
  let sortedCards: Card[] = []
  switch (sort) {
    case 'byUpvotes': {
      sortedCards = cards.toSorted(
        (a, b) => getLengthOrZero(b.upvotedBy) - getLengthOrZero(a.upvotedBy),
      )
      break
    }
    case 'byDiscussed': {
      sortedCards = cards.toSorted((a, b) => {
        if (a.isDiscussed === b.isDiscussed) return 0
        return a.isDiscussed ? 1 : -1
      })
      break
    }
    case 'byActionItems': {
      sortedCards = cards.toSorted(
        (a, b) =>
          getLengthOrZero(b.actionItems) - getLengthOrZero(a.actionItems),
      )
      break
    }
    case 'byComments': {
      sortedCards = cards.toSorted(
        (a, b) => getLengthOrZero(b.comments) - getLengthOrZero(a.comments),
      )
      break
    }
    default: {
      sortedCards = cards
    }
  }
  return sortedCards
}

const getLengthOrZero = (arr: any[] | undefined) => arr?.length ?? 0
