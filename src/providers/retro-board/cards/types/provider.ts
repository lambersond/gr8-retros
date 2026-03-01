import type { BoardCardsFilterOptions, BoardCardsSortOptions } from '../enums'
import type { Card } from '@/types'

export type BoardCardsState = {
  cards: Record<string, Card>
  votingResults: Record<string, string[]>
  sort: BoardCardsSortOptions
  filter: BoardCardsFilterOptions
}
