import type { BoardCardsFilterOptions, BoardCardsSortOptions } from '../enums'
import type { Card, CardGroup } from '@/types'

export type CardGroupState = CardGroup & {
  cardIds: string[]
  isGeneratingLabel?: boolean
  votes?: number
}

export type BoardCardsState = {
  cards: Record<string, Card>
  groups: Record<string, CardGroupState>
  sort: BoardCardsSortOptions
  filter: BoardCardsFilterOptions
}
