'use server'

import prisma from '@/clients/prisma'
import type {
  CreateCardParams,
  EditCardContentParams,
  MarkCardDiscussedParams,
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
    const card = await tx.card.create({
      data: {
        retroSessionId: params.boardId,
        column: params.column,
        content: params.content,
        creatorId: params.creatorId,
        createdBy: params.creatorName,
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
