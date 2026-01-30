import { useBoardCardsByColumn } from '@/providers/retro-board/cards'

export function useCards(column: string) {
  const cards = useBoardCardsByColumn(column)
  return cards
}
