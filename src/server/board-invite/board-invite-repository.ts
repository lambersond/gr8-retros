/* eslint-disable camelcase */
'use server'

import prisma from '@/clients/prisma'

export async function joinBoardByInviteCode(
  inviteCode: string,
  userId: string,
) {
  const invite = await prisma.boardInvite.findUnique({
    where: { token: inviteCode },
    select: {
      boardSettingsId: true,
      expiresAt: true,
      boardSettings: {
        select: {
          retroSessionId: true,
          members: true,
        },
      },
    },
  })

  if (!invite) {
    throw new Error('Invalid invite code')
  }

  if (invite.expiresAt && invite.expiresAt < new Date()) {
    throw new Error('Invite code has expired')
  }

  const [member] = await prisma.$transaction([
    prisma.boardMember.upsert({
      where: {
        userId_settingsId: {
          userId,
          settingsId: invite.boardSettingsId,
        },
      },
      create: {
        userId,
        settingsId: invite.boardSettingsId,
        role: 'MEMBER',
      },
      update: {},
      select: {
        role: true,
        permissionMask: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
  ])

  return {
    member,
    boardId: invite.boardSettings.retroSessionId,
  }
}

export async function getBoardInviteByToken(token: string) {
  return prisma.boardInvite.findUnique({
    where: { token },
    select: {
      revokedAt: true,
      expiresAt: true,
      boardSettings: {
        select: {
          isPrivate: true,
          privateOpenAccess: true,
          retroSessionId: true,
        },
      },
    },
  })
}

export async function createBoardInvite(
  boardSettingsId: string,
  expiresAt?: Date | null,
) {
  const token = crypto.randomUUID().slice(0, 12)

  return prisma.boardInvite.create({
    data: {
      boardSettingsId: boardSettingsId,
      token,
      expiresAt,
    },
    select: {
      token: true,
      expiresAt: true,
    },
  })
}

export async function deleteBoardInviteByBoardSettingsId(
  boardSettingsId: string,
) {
  return prisma.boardInvite.deleteMany({
    where: { boardSettingsId },
  })
}
