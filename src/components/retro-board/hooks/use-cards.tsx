import { useRetroBoard } from '../provider/retro-board-provider'
import type { ColumnType } from '@/types'

export function useCards(column: ColumnType) {
  const state = useRetroBoard()
  const columnState = state[column]

  return {
    cards: columnState.cards,
  }
}
