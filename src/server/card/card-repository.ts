/* eslint-disable unicorn/no-null */
'use server'

import prisma from '@/clients/prisma'
import { decodeBoardId } from '@/lib/board-id'
import {
  getBoardColumnTypes,
  getTailPosition,
  resolveRestoreColumn,
} from '@/server/card-group/restore-utils'
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
  const boardId = decodeBoardId(params.boardId)
  return prisma.$transaction(async tx => {
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
    const maxPosition = Math.max(
      cardMaxResult._max.position ?? 0,
      groupMaxResult._max.position ?? 0,
    )
    const nextPosition = Math.ceil(maxPosition) + 1

    const card = await tx.card.create({
      data: {
        retroSessionId: boardId,
        column: params.column,
        content: params.content,
        creatorId: params.creatorId,
        createdBy: params.creatorName,
        position: nextPosition,
      },
      include: { actionItems: true },
    })

    await tx.retroSession.update({
      where: { id: boardId },
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
  const id = decodeBoardId(boardId)
  return Promise.all(
    migrations.map(({ from, to }) =>
      prisma.card.updateMany({
        where: { retroSessionId: id, column: from },
        data: { column: to },
      }),
    ),
  )
}

export async function deleteCardsByBoardId(boardId: string) {
  return prisma.card.deleteMany({
    where: { retroSessionId: decodeBoardId(boardId) },
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
      retroSessionId: decodeBoardId(boardId),
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
    let { column, position } = params

    if (column === undefined || position === undefined) {
      const card = await tx.card.findUnique({
        where: { id: params.cardId },
        select: {
          retroSessionId: true,
          column: true,
          cardGroup: { select: { column: true } },
        },
      })
      if (card) {
        // Unless told otherwise, a card leaving its group goes back to the
        // column it came from (or the group's, if that column is gone).
        column ??= resolveRestoreColumn(
          card.column,
          card.cardGroup?.column ?? card.column,
          await getBoardColumnTypes(tx, card.retroSessionId),
        )
        if (position === undefined) {
          position = await getTailPosition(tx, card.retroSessionId, column)
        }
      }
    }

    return tx.card.update({
      where: { id: params.cardId },
      data: {
        cardGroupId: null,
        position,
        ...(column && { column }),
      },
      include: { actionItems: true },
    })
  })
}
