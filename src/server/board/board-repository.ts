'use server'

/* eslint-disable unicorn/no-null */
import prisma from '@/clients/prisma'

async function getBoardById(id: string) {
  return prisma.retroSession.findUnique({
    where: { id },
    include: {
      users: {
        select: { userId: true },
      },
      cards: {
        orderBy: { createdAt: 'asc' },
        include: {
          actionItems: true,
          comments: true,
        },
      },
    },
  })
}

async function createBoardByIdAndUserId(id: string, userId: string) {
  return prisma.retroSession.create({
    data: {
      id,
      name: id,
      creatorId: userId,
      users: { create: [] },
    },
    include: {
      users: {
        select: { userId: true },
      },
      cards: {
        orderBy: { createdAt: 'asc' },
        include: {
          actionItems: true,
          comments: true,
        },
      },
    },
  })
}

export async function getOrCreateBoardByIdAndUserId(
  id: string,
  userId: string,
) {
  let board = await getBoardById(id)
  board ??= await createBoardByIdAndUserId(id, userId)

  // If board is not private, return it to anyone
  if (!board.isPrivate) return board

  // If private only return to authorized users
  if (!userId) return null

  const isMember = board.users.some(u => u.userId === userId)

  if (isMember) return board

  // Board is private and user not authorized
  return null
}
