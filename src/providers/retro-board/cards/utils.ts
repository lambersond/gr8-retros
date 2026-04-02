import { cloneDeep } from 'lodash'
import { BoardCardsFilterOptions, BoardCardsSortOptions } from './enums'
import type { BoardCardsState } from './types'
import type { Board, Card } from '@/types'

export function createInitialState(
  board: Board,
  defaultSort = BoardCardsSortOptions.NONE,
  defaultFilter = BoardCardsFilterOptions.ALL,
) {
  const base: BoardCardsState = {
    cards: {},
    groups: {},
    sort: defaultSort,
    filter: defaultFilter,
  }

  for (const card of board.cards) {
    base.cards[card.id] = card
  }

  for (const group of board.cardGroups) {
    base.groups[group.id] = {
      ...group,
      cardIds: board.cards
        .filter(card => card.cardGroupId === group.id)
        .map(card => card.id),
    }
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

export function sortCardsBy(cards: Card[], sort: BoardCardsSortOptions) {
  return cardSortFunctions[sort]?.(cards) ?? cards
}

export function filterCardsBy(cards: Card[], filter: BoardCardsFilterOptions) {
  return cardFilterFunctions[filter]?.(cards) ?? cards
}

// -------------------------------------------------------------------------------
// Private utils
// -------------------------------------------------------------------------------

const getLengthOrZero = (arr: any[] | undefined) => arr?.length ?? 0

const cardFilterFunctions = {
  [BoardCardsFilterOptions.WITH_VOTES]: (cards: Card[]) =>
    cards.filter(card => (card.votes ?? 0) > 0),
  [BoardCardsFilterOptions.WITHOUT_VOTES]: (cards: Card[]) =>
    cards.filter(card => !card.votes),
  [BoardCardsFilterOptions.ALL]: (cards: Card[]) => cards,
} satisfies Record<BoardCardsFilterOptions, (cards: Card[]) => Card[]>

const cardSortFunctions = {
  [BoardCardsSortOptions.BY_UPVOTES]: (cards: Card[]) =>
    cards.toSorted(
      (a, b) => getLengthOrZero(b.upvotedBy) - getLengthOrZero(a.upvotedBy),
    ),
  [BoardCardsSortOptions.BY_DISCUSSED]: (cards: Card[]) =>
    cards.toSorted((a, b) => {
      if (a.isDiscussed === b.isDiscussed) return 0
      return a.isDiscussed ? 1 : -1
    }),
  [BoardCardsSortOptions.BY_ACTION_ITEM_COUNT]: (cards: Card[]) =>
    cards.toSorted(
      (a, b) => getLengthOrZero(b.actionItems) - getLengthOrZero(a.actionItems),
    ),
  [BoardCardsSortOptions.BY_COMMENT_COUNT]: (cards: Card[]) =>
    cards.toSorted(
      (a, b) => getLengthOrZero(b.comments) - getLengthOrZero(a.comments),
    ),
  [BoardCardsSortOptions.BY_NEWEST]: (cards: Card[]) =>
    cards.toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
  [BoardCardsSortOptions.BY_OLDEST]: (cards: Card[]) =>
    cards.toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
  [BoardCardsSortOptions.NONE]: (cards: Card[]) => cards,
  [BoardCardsSortOptions.BY_VOTES]: (cards: Card[]) =>
    cards.toSorted((a, b) => (b.votes ?? 0) - (a.votes ?? 0)),
} satisfies Record<BoardCardsSortOptions, (cards: Card[]) => Card[]>
