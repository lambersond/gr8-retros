import { BoardCardsFilterOptions, BoardCardsSortOptions } from './enums'
import type { BoardCardsState } from './types'

export const DEFAULT_STATE: BoardCardsState = {
  cards: {},
  groups: {},
  sort: BoardCardsSortOptions.NONE,
  filter: BoardCardsFilterOptions.ALL,
}
