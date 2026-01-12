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
            select: { id: true, retroSessionId: true },
          },
          role: true,
          settingsId: true,
        },
      },
    },
  })
}
