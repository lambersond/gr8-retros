/* eslint-disable unicorn/no-null */
'use server'

import prisma from '@/clients/prisma'
import type {
  AddCardToGroupParams,
  CreateCardParams,
  EditCardContentParams,
  MarkCardDiscussedParams,
  RemoveCardFromGroupParams,
  UpdateCardPositionParams,
  UpvoteCardParams,
} from '@/types'

export async function getCardById(cardId: string) {
  return prisma.card.findUnique({
    where: { id: cardId },
    include: { actionItems: true },
  })
}

export async function createCard(params: CreateCardParams) {
  return prisma.$transaction(async tx => {
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
    const maxPosition = Math.max(
      cardMaxResult._max.position ?? 0,
      groupMaxResult._max.position ?? 0,
    )
    const nextPosition = Math.ceil(maxPosition) + 1

    const card = await tx.card.create({
      data: {
        retroSessionId: params.boardId,
        column: params.column,
        content: params.content,
        creatorId: params.creatorId,
        createdBy: params.creatorName,
        position: nextPosition,
      },
      include: { actionItems: true },
    })

    await tx.retroSession.update({
      where: { id: params.boardId },
      data: { updatedAt: new Date() },
    })

    return card
  })
}

export async function editCardContent(params: EditCardContentParams) {
  return prisma.card.update({
    where: { id: params.cardId },
    data: {
      content: params.newContent,
      retroSession: {
        update: {
          updatedAt: new Date(),
        },
      },
    },
    include: { actionItems: true },
  })
}

export async function markCardDiscussed(params: MarkCardDiscussedParams) {
  return prisma.card.update({
    where: { id: params.cardId },
    data: {
      isDiscussed: params.isDiscussed,
      retroSession: {
        update: {
          updatedAt: new Date(),
        },
      },
    },
    include: { actionItems: true },
  })
}

export async function upvoteCard(params: UpvoteCardParams) {
  return prisma.card.update({
    where: { id: params.cardId },
    data: {
      upvotedBy: params.upvotedBy,
      retroSession: {
        update: {
          updatedAt: new Date(),
        },
      },
    },
    include: { actionItems: true },
  })
}

export async function updateManyCardColumnTypes(
  boardId: string,
  migrations: { from: string; to: string }[],
) {
  if (migrations.length === 0) return
  return Promise.all(
    migrations.map(({ from, to }) =>
      prisma.card.updateMany({
        where: { retroSessionId: boardId, column: from },
        data: { column: to },
      }),
    ),
  )
}

export async function deleteCardsByBoardId(boardId: string) {
  return prisma.card.deleteMany({
    where: { retroSessionId: boardId },
  })
}

export async function deleteCardById(cardId: string) {
  return prisma.card.delete({
    where: { id: cardId },
  })
}

export async function deleteCardsByIds(cardIds: string[]) {
  if (cardIds.length === 0) return { count: 0 }
  return prisma.card.deleteMany({
    where: { id: { in: cardIds } },
  })
}

export async function deleteCompletedCardsByBoardId(boardId: string) {
  return prisma.card.deleteMany({
    where: {
      retroSessionId: boardId,
      AND: [
        { isDiscussed: true },
        { actionItems: { every: { isDone: true } } },
      ],
    },
  })
}

export async function deleteCompletedCardsOlderThanNDays(days = 7) {
  const nDaysAgo = new Date()
  nDaysAgo.setDate(nDaysAgo.getDate() - days)
  nDaysAgo.setHours(0, 0, 0, 0)

  return prisma.card.deleteMany({
    where: {
      createdAt: {
        lt: nDaysAgo,
      },
      isDiscussed: true,
      actionItems: {
        every: { isDone: true },
      },
    },
  })
}

export async function deleteCompletedCardsOlderThanNDaysByBoardId(
  boardId: string,
  days = 7,
) {
  const nDaysAgo = new Date()
  nDaysAgo.setDate(nDaysAgo.getDate() - days)
  nDaysAgo.setHours(0, 0, 0, 0)

  return prisma.card.deleteMany({
    where: {
      retroSessionId: boardId,
      createdAt: {
        lt: nDaysAgo,
      },
      isDiscussed: true,
      actionItems: {
        every: { isDone: true },
      },
    },
  })
}

export async function updateCardPosition(params: UpdateCardPositionParams) {
  return prisma.card.update({
    where: { id: params.cardId },
    data: { position: params.position, column: params.column },
    include: { actionItems: true },
  })
}

export async function addCardToGroup(params: AddCardToGroupParams) {
  return prisma.card.update({
    where: { id: params.cardId },
    data: { cardGroupId: params.cardGroupId, position: null },
    include: { actionItems: true },
  })
}

export async function removeCardFromGroup(params: RemoveCardFromGroupParams) {
  return prisma.$transaction(async tx => {
    let position = params.position

    if (position === undefined) {
      const card = await tx.card.findUnique({
        where: { id: params.cardId },
        select: { retroSessionId: true, column: true },
      })
      if (card) {
        const targetColumn = params.column ?? card.column
        const [cardMaxResult, groupMaxResult] = await Promise.all([
          tx.card.aggregate({
            where: {
              retroSessionId: card.retroSessionId,
              column: targetColumn,
              cardGroupId: null,
            },
            _max: { position: true },
          }),
          tx.cardGroup.aggregate({
            where: {
              retroSessionId: card.retroSessionId,
              column: targetColumn,
            },
            _max: { position: true },
          }),
        ])
        const maxPosition = Math.max(
          cardMaxResult._max.position ?? 0,
          groupMaxResult._max.position ?? 0,
        )
        position = Math.ceil(maxPosition) + 1
      }
    }

    return tx.card.update({
      where: { id: params.cardId },
      data: {
        cardGroupId: null,
        position,
        ...(params.column && { column: params.column }),
      },
      include: { actionItems: true },
    })
  })
}
