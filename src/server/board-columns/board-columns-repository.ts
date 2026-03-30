'use server'

import prisma from '@/clients/prisma'
import type { CreateOperation, UpdateOperation } from './types'

export async function deleteManyByIds(ids: string[]) {
  if (ids.length === 0) return
  return prisma.boardColumn.deleteMany({
    where: { id: { in: ids } },
  })
}

export async function createMany(operations: CreateOperation[]) {
  if (operations.length === 0) return
  return prisma.boardColumn.createMany({
    data: operations,
  })
}

export async function updateMany(operations: UpdateOperation[]) {
  if (operations.length === 0) return []
  return Promise.all(
    operations.map(op =>
      prisma.boardColumn.update({
        where: { id: op.id },
        data: op.data,
      }),
    ),
  )
}

export async function findManyByBoardSettingsId(boardSettingsId: string) {
  return prisma.boardColumn.findMany({
    where: { boardSettingsId },
  })
}
