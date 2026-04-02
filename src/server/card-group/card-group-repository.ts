/* eslint-disable unicorn/no-null */
'use server'

import prisma from '@/clients/prisma'
import type { CreateCardGroupParams, EditCardGroupParams } from '@/types'

const cardInclude = { actionItems: true } as const
const groupInclude = { cards: { include: cardInclude } } as const

export async function createCardGroup(params: CreateCardGroupParams) {
  return prisma.$transaction(async tx => {
    let groupPosition = params.position

    if (groupPosition === undefined) {
      const [cardMaxResult, groupMaxResult] = await Promise.all([
        tx.card.aggregate({
          where: {
            retroSessionId: params.boardId,
            column: params.column,
            cardGroupId: null,
          },
          _max: { position: true },
        }),
        tx.cardGroup.aggregate({
          where: { retroSessionId: params.boardId, column: params.column },
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
        retroSessionId: params.boardId,
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

export async function editCardGroup(params: EditCardGroupParams) {
  return prisma.$transaction(async tx => {
    if (params.column !== undefined) {
      await tx.card.updateMany({
        where: { cardGroupId: params.cardGroupId },
        data: { column: params.column },
      })
    }

    return tx.cardGroup.update({
      where: { id: params.cardGroupId },
      data: {
        ...(params.label !== undefined && { label: params.label }),
        ...(params.position !== undefined && { position: params.position }),
        ...(params.column !== undefined && { column: params.column }),
      },
      include: groupInclude,
    })
  })
}

export async function deleteCardGroup(cardGroupId: string) {
  return prisma.$transaction(async tx => {
    const group = await tx.cardGroup.findUnique({
      where: { id: cardGroupId },
      include: { cards: true },
    })

    if (!group) return

    const [cardMaxResult, groupMaxResult] = await Promise.all([
      tx.card.aggregate({
        where: {
          retroSessionId: group.retroSessionId,
          column: group.column,
          cardGroupId: null,
        },
        _max: { position: true },
      }),
      tx.cardGroup.aggregate({
        where: {
          retroSessionId: group.retroSessionId,
          column: group.column,
          id: { not: cardGroupId },
        },
        _max: { position: true },
      }),
    ])

    let nextPosition =
      Math.ceil(
        Math.max(
          cardMaxResult._max.position ?? 0,
          groupMaxResult._max.position ?? 0,
        ),
      ) + 1

    for (const card of group.cards) {
      await tx.card.update({
        where: { id: card.id },
        data: {
          cardGroupId: null,
          column: group.column,
          position: nextPosition,
        },
      })
      nextPosition += 1
    }

    return tx.cardGroup.delete({ where: { id: cardGroupId } })
  })
}

export async function deleteEmptyCardGroup(cardGroupId: string) {
  return prisma.$transaction(async tx => {
    const group = await tx.cardGroup.findUnique({
      where: { id: cardGroupId },
      include: { cards: true },
    })

    if (!group) return

    const [remainingCard] = group.cards

    const [cardMaxResult, groupMaxResult] = await Promise.all([
      tx.card.aggregate({
        where: {
          retroSessionId: group.retroSessionId,
          column: group.column,
          cardGroupId: null,
        },
        _max: { position: true },
      }),
      tx.cardGroup.aggregate({
        where: {
          retroSessionId: group.retroSessionId,
          column: group.column,
          id: { not: cardGroupId },
        },
        _max: { position: true },
      }),
    ])

    const tailPosition =
      Math.ceil(
        Math.max(
          cardMaxResult._max.position ?? 0,
          groupMaxResult._max.position ?? 0,
        ),
      ) + 1

    const updatedCard = await tx.card.update({
      where: { id: remainingCard.id },
      data: {
        cardGroupId: null,
        column: group.column,
        position: tailPosition,
      },
      include: cardInclude,
    })

    await tx.cardGroup.delete({ where: { id: cardGroupId } })

    return updatedCard
  })
}

export async function getCardGroupById(cardGroupId: string) {
  return prisma.cardGroup.findUnique({
    where: { id: cardGroupId },
    include: { cards: true },
  })
}
