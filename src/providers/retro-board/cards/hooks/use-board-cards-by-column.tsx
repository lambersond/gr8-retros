import { useBoardCards } from '../provider'
import { sortCardsBy } from '../utils'

export function useBoardCardsByColumn(column: string) {
  const boardCards = useBoardCards()
  const unsortedCards = Object.values(boardCards.cards).filter(
    card => card.column === column,
  )
  return sortCardsBy(unsortedCards, boardCards.sort)
}
