import type { BoardCardsSortOptions } from '../enums'
import type { Card } from '@/types'

export type BoardCardsState = {
  cards: Record<string, Card>
  sort: BoardCardsSortOptions
}
