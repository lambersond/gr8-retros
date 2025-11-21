'use server'

import prisma from '@/clients/prisma'

export async function addComment(data: any) {
  return prisma.comment.create({
    data: {
      content: data.content,
      cardId: data.cardId,
      creatorId: data.creatorId,
      createdBy: data.creatorName,
    },
  })
}

export async function deleteCommentByIdAndCreatorId(
  id: string,
  creatorId: string,
) {
  return prisma.comment.delete({
    where: { id, creatorId },
  })
}

export async function updateComment(
  id: string,
  userId: string,
  content: string,
) {
  return prisma.comment.update({
    where: { id, creatorId: userId },
    data: { content },
  })
}

export async function getCommentsByCardId(cardId: string) {
  return prisma.comment.findMany({
    where: { cardId },
    orderBy: { createdAt: 'asc' },
  })
}
