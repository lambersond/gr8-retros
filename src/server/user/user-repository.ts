'use server'

import prisma from '@/clients/prisma'

export async function getBoardPermissions(
  userId: string,
  boardSettingsId: string,
) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      boards: {
        where: { settingsId: boardSettingsId },
        select: {
          role: true,
        },
      },
    },
  })
}

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      paymentTier: true,
      boards: {
        select: {
          settings: {
            select: {
              id: true,
              retroSessionId: true,
              retroSession: {
                select: { name: true },
              },
            },
          },
          role: true,
          settingsId: true,
        },
      },
    },
  })
}

export async function getUserInfo(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      paymentTier: true,
    },
  })
}

export async function getUserBoards(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      boards: {
        select: {
          settings: {
            select: {
              retroSession: {
                select: { id: true, name: true },
              },
            },
          },
          role: true,
        },
      },
    },
  })
}

export async function getUserActionItems(userId: string) {
  return prisma.actionItem.findMany({
    where: { assignedToId: userId },
    select: {
      id: true,
      content: true,
      isDone: true,
      card: {
        select: {
          content: true,
          column: true,
          retroSessionId: true,
          retroSession: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  })
}
