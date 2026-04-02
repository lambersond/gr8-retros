'use server'

import { CreateBoardProps } from './types'
import prisma from '@/clients/prisma'
import { buildDefaultColumnData } from '@/utils/column-utils'

export async function getOrCreateBoardById(id: string) {
  const board = await prisma.retroSession.upsert({
    where: { id },
    create: {
      id,
      name: id,
      settings: {
        create: {
          columns: { createMany: { data: buildDefaultColumnData() } },
        },
      },
    },
    update: {
      settings: {
        upsert: {
          create: {
            columns: { createMany: { data: buildDefaultColumnData() } },
          },
          update: {},
        },
      },
      updatedAt: new Date(),
    },
    include: {
      settings: {
        include: {
          columns: { orderBy: { index: 'asc' } },
          members: {
            select: {
              permissionMask: true,
              role: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  paymentTier: true,
                },
              },
            },
          },
          invite: {
            select: {
              token: true,
              expiresAt: true,
            },
          },
        },
      },
      cards: {
        orderBy: { createdAt: 'asc' },
        include: {
          actionItems: {
            include: {
              assignedTo: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
          comments: true,
        },
      },
      cardGroups: {
        orderBy: { position: 'asc' },
      },
    },
  })

  // Seed default columns for existing boards that have none
  if (board.settings?.columns.length === 0) {
    await prisma.boardColumn.createMany({
      data: buildDefaultColumnData().map(col => ({
        ...col,
        boardSettingsId: board.settings!.id,
      })),
    })
    board.settings.columns = await prisma.boardColumn.findMany({
      where: { boardSettingsId: board.settings.id },
      orderBy: { index: 'asc' },
    })
  }

  return board
}

export async function deleteBoardsOlderThanDate(cutoffDate: Date) {
  return prisma.retroSession.deleteMany({
    where: {
      updatedAt: {
        lt: cutoffDate,
      },
    },
  })
}

export async function getAllTempOrgBoards() {
  return prisma.retroSession.findMany({
    where: {
      org: 'Temporary',
    },
    include: {
      settings: {
        select: {
          privateCardRetention: true,
          ownerId: true,
          members: {
            where: { role: 'OWNER' },
            select: {
              user: {
                select: {
                  paymentTier: true,
                },
              },
            },
          },
        },
      },
    },
  })
}

export async function deleteManyBoardsByIds(boardIds: string[]) {
  return prisma.retroSession.deleteMany({
    where: {
      id: {
        in: boardIds,
      },
    },
  })
}

export async function getBoardByName(id: string) {
  return prisma.retroSession.findUnique({
    where: {
      id,
    },
  })
}

export async function createBoard(data: CreateBoardProps) {
  const { boardName, ownerId } = data
  const boardId = encodeURIComponent(boardName)
  return prisma.retroSession.create({
    data: {
      id: boardId,
      name: boardName,
      settings: {
        create: {
          ownerId,
          members: {
            create: {
              userId: ownerId,
              role: 'OWNER',
            },
          },
          columns: {
            createMany: { data: buildDefaultColumnData() },
          },
        },
      },
    },
  })
}
