/* eslint-disable unicorn/no-null */
// Deliberately NOT a 'use server' module: every export of one becomes a server
// action clients can call, and these helpers take a live transaction.
import type { RestoredCard } from '@/types'
import type { Prisma } from '@prisma/client'

type Tx = Prisma.TransactionClient

export async function getBoardColumnTypes(tx: Tx, retroSessionId: string) {
  const columns = await tx.boardColumn.findMany({
    where: { settings: { retroSessionId } },
    select: { columnType: true },
  })
  return new Set(columns.map(column => column.columnType))
}

// A grouped card keeps the column it came from in `column` (the group's own
// column decides where the group shows), so leaving a group sends it back
// there. If that column has since been removed, it stays where the group was
// rather than becoming orphaned.
export function resolveRestoreColumn(
  cardColumn: string,
  groupColumn: string,
  validColumnTypes: Set<string>,
) {
  if (validColumnTypes.size === 0 || validColumnTypes.has(cardColumn)) {
    return cardColumn
  }
  return groupColumn
}

// The next position after every standalone card and group in a column.
export async function getTailPosition(
  tx: Tx,
  retroSessionId: string,
  column: string,
  excludeGroupId?: string,
) {
  const [cardMaxResult, groupMaxResult] = await Promise.all([
    tx.card.aggregate({
      where: { retroSessionId, column, cardGroupId: null },
      _max: { position: true },
    }),
    tx.cardGroup.aggregate({
      where: {
        retroSessionId,
        column,
        ...(excludeGroupId && { id: { not: excludeGroupId } }),
      },
      _max: { position: true },
    }),
  ])
  return (
    Math.ceil(
      Math.max(
        cardMaxResult._max.position ?? 0,
        groupMaxResult._max.position ?? 0,
      ),
    ) + 1
  )
}

// Sends each card leaving a group to its restore column, appended in order at
// the end of that column.
export async function restoreGroupCards(
  tx: Tx,
  group: { id: string; column: string; retroSessionId: string },
  cards: { id: string; column: string }[],
): Promise<RestoredCard[]> {
  const validColumnTypes = await getBoardColumnTypes(tx, group.retroSessionId)
  const nextPositions = new Map<string, number>()
  const restored: RestoredCard[] = []

  for (const card of cards) {
    const column = resolveRestoreColumn(
      card.column,
      group.column,
      validColumnTypes,
    )
    const position =
      nextPositions.get(column) ??
      (await getTailPosition(tx, group.retroSessionId, column, group.id))
    nextPositions.set(column, position + 1)

    await tx.card.update({
      where: { id: card.id },
      data: { cardGroupId: null, column, position },
    })
    restored.push({ cardId: card.id, column, position })
  }

  return restored
}
