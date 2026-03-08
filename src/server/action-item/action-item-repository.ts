'use server'

import prisma from '@/clients/prisma'
import type { CreateActionItemParams } from '@/types'

const SELECT = {
  id: true,
  cardId: true,
  content: true,
  isDone: true,
  createdBy: true,
  assignedTo: {
    select: {
      id: true,
      name: true,
      image: true,
    },
  },
} as const

export async function createActionItem(data: CreateActionItemParams['item']) {
  return prisma.actionItem.create({
    data,
    select: SELECT,
  })
}

export async function updateActionItem(
  actionItemId: string,
  updates: Partial<{
    isDone: boolean
    content: string
    assignedToId: string | null
  }>,
) {
  // Destructure assignedToId from updates and prepare the rest
  const { assignedToId, ...restUpdates } = updates

  return prisma.actionItem.update({
    where: { id: actionItemId },
    data: {
      ...restUpdates,
      ...(assignedToId !== undefined && {
        assignedTo:
          assignedToId === null
            ? { disconnect: true }
            : { connect: { id: assignedToId } },
      }),
      card: {
        update: {
          updatedAt: new Date(),
          retroSession: {
            update: {
              updatedAt: new Date(),
            },
          },
        },
      },
    },
    select: SELECT,
  })
}

export async function deleteActionItem(actionItemId: string) {
  return prisma.actionItem.delete({
    where: { id: actionItemId },
  })
}

export async function deleteOwnActionItem(
  actionItemId: string,
  userId: string,
) {
  return prisma.actionItem.delete({
    where: { id: actionItemId, createdBy: userId },
  })
}
