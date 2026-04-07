import { useMemo } from 'react'
import { useBoardCards } from '../provider'
import { useBoardColumns } from '@/providers/retro-board/columns'
import type { CardGroupState } from '../types'
import type { Card } from '@/types'

type OrphanedItem =
  | { kind: 'card'; data: Card }
  | { kind: 'group'; data: CardGroupState }

export function useOrphanedItems(): OrphanedItem[] {
  const boardCards = useBoardCards()
  const { columns } = useBoardColumns()

  return useMemo(() => {
    const validColumnTypes = new Set(columns.map(c => c.columnType))

    const orphanedCards = Object.values(boardCards.cards).filter(
      card => !validColumnTypes.has(card.column) && !card.cardGroupId,
    )

    const orphanedGroups = Object.values(boardCards.groups).filter(
      group => !validColumnTypes.has(group.column),
    )

    const items: OrphanedItem[] = [
      ...orphanedCards.map(card => ({ kind: 'card' as const, data: card })),
      ...orphanedGroups.map(group => ({
        kind: 'group' as const,
        data: group,
      })),
    ]

    return items
  }, [boardCards.cards, boardCards.groups, columns])
}
