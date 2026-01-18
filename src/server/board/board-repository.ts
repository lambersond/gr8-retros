'use server'

import prisma from '@/clients/prisma'

export async function getOrCreateBoardById(id: string) {
  return prisma.retroSession.upsert({
    where: { id },
    create: {
      id,
      name: id,
      settings: { create: {} },
    },
    update: {
      settings: {
        upsert: {
          create: {},
          update: {},
        },
      },
      updatedAt: new Date(),
    },
    include: {
      settings: {
        include: {
          members: {
            select: {
              permissionMask: true,
              role: true,
              user: {
                select: {
                  id: true,
                  name: true,
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
        include: { actionItems: true, comments: true },
      },
    },
  })
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
