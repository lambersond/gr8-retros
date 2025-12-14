import type { Card } from '@/types'

export type ColumnState = {
  cards: Card[]
}

export type CardsState = {
  GOOD: ColumnState
  MEH: ColumnState
  BAD: ColumnState
  SHOUTOUT: ColumnState
}
