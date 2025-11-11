'use server'

import prisma from '@/clients/prisma'
import type { CreateActionItemParams } from '@/types'

export async function createActionItem({
  cardId,
  content,
  createdBy,
}: CreateActionItemParams) {
  return prisma.actionItem.create({
    data: {
      cardId,
      content,
      createdBy,
    },
  })
}

export async function updateActionItem(
  actionItemId: string,
  updates: Partial<{ isDone: boolean; content: string }>,
) {
  return prisma.actionItem.update({
    where: { id: actionItemId },
    data: updates,
  })
}
