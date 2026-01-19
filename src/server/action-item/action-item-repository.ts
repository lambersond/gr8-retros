'use server'

import prisma from '@/clients/prisma'
import type { CreateActionItemParams } from '@/types'

const SELECT = {
  id: true,
  cardId: true,
  card: {
    // TODO: temp until card refactor is done
    select: {
      column: true,
    },
  },
  content: true,
  isDone: true,
  createdBy: true,
  createdAt: true,
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
  return prisma.actionItem.update({
    where: { id: actionItemId },
    data: updates,
    select: SELECT,
  })
}
