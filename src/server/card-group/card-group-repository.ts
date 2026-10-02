/* eslint-disable unicorn/no-null */
'use server'

import { restoreGroupCards } from './restore-utils'
import prisma from '@/clients/prisma'
import { decodeBoardId } from '@/lib/board-id'
import type {
  CreateCardGroupParams,
  EditCardGroupParams,
  RestoredCard,
} from '@/types'

const cardInclude = { actionItems: true } as const
const groupInclude = { cards: { include: cardInclude } } as const

export async function createCardGroup(params: CreateCardGroupParams) {
  const boardId = decodeBoardId(params.boardId)
  return prisma.$transaction(async tx => {
    let groupPosition = params.position ?? undefined

    if (groupPosition === undefined) {
      const [cardMaxResult, groupMaxResult] = await Promise.all([
        tx.card.aggregate({
          where: {
            retroSessionId: boardId,
            column: params.column,
            cardGroupId: null,
          },
          _max: { position: true },
        }),
        tx.cardGroup.aggregate({
          where: { retroSessionId: boardId, column: params.column },
          _max: { position: true },
        }),
      ])
      groupPosition =
        Math.ceil(
          Math.max(
            cardMaxResult._max.position ?? 0,
            groupMaxResult._max.position ?? 0,
          ),
        ) + 1
    }

    const group = await tx.cardGroup.create({
      data: {
        retroSessionId: boardId,
        column: params.column,
        label: params.label,
        position: groupPosition,
      },
    })

    await tx.card.updateMany({
      where: { id: { in: [params.cardId1, params.cardId2] } },
      data: { cardGroupId: group.id, position: null },
    })

    return tx.cardGroup.findUnique({
      where: { id: group.id },
      include: groupInclude,
    })
  })
}

// Moving a group leaves its cards' own `column` alone: that's the column each
// card came from, which the group displays and ungrouping restores.
export async function editCardGroup(params: EditCardGroupParams) {
  return prisma.cardGroup.update({
    where: { id: params.cardGroupId },
    data: {
      ...(params.label !== undefined && { label: params.label }),
      ...(params.position !== undefined && { position: params.position }),
      ...(params.column !== undefined && { column: params.column }),
    },
    include: groupInclude,
  })
}

// Dissolves the group, sending each card back to the column it came from.
// Returns where every card landed so clients can mirror it exactly.
export async function deleteCardGroup(
  cardGroupId: string,
): Promise<RestoredCard[]> {
  return prisma.$transaction(async tx => {
    const group = await tx.cardGroup.findUnique({
      where: { id: cardGroupId },
      include: { cards: true },
    })

    if (!group) return []

    const restored = await restoreGroupCards(tx, group, group.cards)
    await tx.cardGroup.delete({ where: { id: cardGroupId } })
    return restored
  })
}

// A group down to its last card dissolves the same way.
export async function deleteEmptyCardGroup(
  cardGroupId: string,
): Promise<RestoredCard[]> {
  return deleteCardGroup(cardGroupId)
}

export async function getCardGroupById(cardGroupId: string) {
  return prisma.cardGroup.findUnique({
    where: { id: cardGroupId },
    include: { cards: true },
  })
}

export async function deleteCardGroupsByIds(groupIds: string[]) {
  if (groupIds.length === 0) return { count: 0 }
  return prisma.cardGroup.deleteMany({
    where: { id: { in: groupIds } },
  })
}

export async function getCardGroupsWithCardCount(boardId: string) {
  return prisma.cardGroup.findMany({
    where: { retroSessionId: decodeBoardId(boardId) },
    select: {
      id: true,
      _count: { select: { cards: true } },
    },
  })
}
