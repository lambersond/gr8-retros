import { useBoardCards } from '@/providers/retro-board/cards'
import type { ColumnType } from '@/types'

export function useCards(column: ColumnType) {
  const state = useBoardCards()
  const columnState = state[column]

  return {
    cards: columnState.cards,
  }
}
