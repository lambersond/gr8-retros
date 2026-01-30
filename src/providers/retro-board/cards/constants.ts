import { BoardCardsSortOptions } from './enums'
import type { BoardCardsState } from './types'

export const DEFAULT_STATE: BoardCardsState = {
  sort: BoardCardsSortOptions.NONE,
  cards: {},
}
