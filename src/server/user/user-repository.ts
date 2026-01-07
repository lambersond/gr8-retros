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
