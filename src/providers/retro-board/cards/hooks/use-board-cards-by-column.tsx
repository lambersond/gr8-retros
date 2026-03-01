import { useBoardCards } from '../provider'
import { filterCardsBy, sortCardsBy } from '../utils'

export function useBoardCardsByColumn(column: string) {
  const boardCards = useBoardCards()
  const unsortedCards = Object.values(boardCards.cards).filter(
    card => card.column === column,
  )

  const filteredCards = filterCardsBy(
    unsortedCards,
    boardCards.filter,
    boardCards.votingResults,
  )
  return sortCardsBy(filteredCards, boardCards.sort)
}
