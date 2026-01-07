/* eslint-disable camelcase */
'use server'

import prisma from '@/clients/prisma'

export async function updateSettingById(
  settingId: string,
  userId: string,
  patch: Record<string, any>,
) {
  return prisma.boardSettings.update({
    where: {
      id: settingId,
      members: {
        some: {
          userId,
        },
      },
    },
    data: patch,
  })
}

export async function claimBoardSettings(settingsId: string, userId: string) {
  return prisma.boardSettings.update({
    where: {
      id: settingsId,
      // eslint-disable-next-line unicorn/no-null
      ownerId: null,
    },
    data: {
      ownerId: userId,
      members: {
        upsert: {
          where: {
            userId_settingsId: {
              userId,
              settingsId,
            },
          },
          create: {
            userId,
            role: 'OWNER',
          },
          update: {
            role: 'OWNER',
          },
        },
      },
    },
    include: {
      members: {
        where: {
          role: 'OWNER',
        },
        select: {
          role: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  })
}
