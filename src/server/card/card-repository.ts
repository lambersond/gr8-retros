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
  return prisma.card.create({
    data: {
      retroSessionId: params.boardId,
      column: params.column,
      content: params.content,
      creatorId: params.creatorId,
      createdBy: params.creatorName,
    },
    include: { actionItems: true },
  })
}

export async function editCardContent(params: EditCardContentParams) {
  return prisma.card.update({
    where: { id: params.cardId },
    data: { content: params.newContent },
    include: { actionItems: true },
  })
}

export async function markCardDiscussed(params: MarkCardDiscussedParams) {
  return prisma.card.update({
    where: { id: params.cardId },
    data: { isDiscussed: params.isDiscussed },
    include: { actionItems: true },
  })
}

export async function upvoteCard(params: UpvoteCardParams) {
  return prisma.card.update({
    where: { id: params.cardId },
    data: { upvotedBy: params.upvotedBy },
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

export async function deleteCompletedCardsOlderThan7Days() {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  sevenDaysAgo.setHours(0, 0, 0, 0) // Set to midnight

  return prisma.card.deleteMany({
    where: {
      createdAt: {
        lt: sevenDaysAgo,
      },
      isDiscussed: true,
      actionItems: {
        every: { isDone: true },
      },
    },
  })
}
