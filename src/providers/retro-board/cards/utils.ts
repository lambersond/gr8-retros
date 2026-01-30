import { cloneDeep } from 'lodash'
import { BoardCardsSortOptions } from './enums'
import type { BoardCardsState } from './types'
import type { Board, Card } from '@/types'

export function createInitialState(
  board: Board,
  defaultSort = BoardCardsSortOptions.NONE,
) {
  const base: BoardCardsState = { cards: {}, sort: defaultSort }

  for (const card of board.cards) {
    base.cards[card.id] = card
  }

  return base
}

export function updateCard(
  state: BoardCardsState,
  cardId: string,
  updater: (card: Card) => Card,
) {
  const newState = cloneDeep(state)

  if (newState.cards[cardId]) {
    const updatedCard = updater(newState.cards[cardId])
    newState.cards[cardId] = updatedCard
  }
  return newState
}

const getLengthOrZero = (arr: any[] | undefined) => arr?.length ?? 0

export function sortCardsBy(cards: Card[], sort: BoardCardsSortOptions) {
  let sortedCards: Card[] = []
  switch (sort) {
    case BoardCardsSortOptions.BY_VOTES: {
      sortedCards = cards.toSorted(
        (a, b) => getLengthOrZero(b.upvotedBy) - getLengthOrZero(a.upvotedBy),
      )
      break
    }
    case BoardCardsSortOptions.BY_DISCUSSED: {
      sortedCards = cards.toSorted((a, b) => {
        if (a.isDiscussed === b.isDiscussed) return 0
        return a.isDiscussed ? 1 : -1
      })
      break
    }
    case BoardCardsSortOptions.BY_ACTION_ITEM_COUNT: {
      sortedCards = cards.toSorted(
        (a, b) =>
          getLengthOrZero(b.actionItems) - getLengthOrZero(a.actionItems),
      )
      break
    }
    case BoardCardsSortOptions.BY_COMMENT_COUNT: {
      sortedCards = cards.toSorted(
        (a, b) => getLengthOrZero(b.comments) - getLengthOrZero(a.comments),
      )
      break
    }
    case BoardCardsSortOptions.BY_NEWEST: {
      sortedCards = cards.toSorted(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      )
      break
    }
    case BoardCardsSortOptions.BY_OLDEST: {
      sortedCards = cards.toSorted(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
      )
      break
    }
    default: {
      sortedCards = cards
    }
  }
  return sortedCards
}
