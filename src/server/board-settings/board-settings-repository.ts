/* eslint-disable camelcase */
'use server'

import prisma from '@/clients/prisma'
import { BoardRole } from '@/enums'
import { buildDefaultColumnData } from '@/utils/column-utils'

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

export async function updateBoardMemberRole(
  settingsId: string,
  userId: string,
  newRole: BoardRole,
) {
  return prisma.boardMember.update({
    where: {
      userId_settingsId: {
        userId,
        settingsId,
      },
    },
    data: {
      role: newRole,
    },
    select: {
      userId: true,
      role: true,
      settings: {
        select: {
          retroSessionId: true,
        },
      },
    },
  })
}

export async function removeBoardMember(settingsId: string, userId: string) {
  return prisma.boardMember.delete({
    where: {
      userId_settingsId: {
        userId,
        settingsId,
      },
    },
    select: {
      userId: true,
      settings: {
        select: {
          retroSessionId: true,
        },
      },
    },
  })
}

export async function deleteBoardSettingById(
  settingsId: string,
  userId: string,
) {
  return prisma.boardSettings.delete({
    where: {
      id: settingsId,
      members: {
        some: {
          userId,
        },
      },
    },
  })
}

export async function transferBoardOwnership(
  settingsId: string,
  previousOwnerId: string,
  newOwnerId: string,
  settingsPatch: Record<string, any>,
) {
  return prisma.$transaction(async tx => {
    // Demote previous owner to ADMIN
    await tx.boardMember.update({
      where: {
        userId_settingsId: { userId: previousOwnerId, settingsId },
      },
      data: { role: BoardRole.ADMIN },
    })

    // Promote new owner to OWNER
    await tx.boardMember.update({
      where: {
        userId_settingsId: { userId: newOwnerId, settingsId },
      },
      data: { role: BoardRole.OWNER },
    })

    // Update ownerId and disable tier-gated settings
    const updatedSettings = await tx.boardSettings.update({
      where: { id: settingsId },
      data: {
        ownerId: newOwnerId,
        ...settingsPatch,
      },
      select: {
        retroSessionId: true,
        isFacilitatorModeEnabled: true,
        cardGroupingEnabled: true,
        aiCardGroupNamingEnabled: true,
        isAiSummaryEnabled: true,
        ownerId: true,
      },
    })

    return updatedSettings
  })
}

export async function resetBoardSettings(settingsId: string, ownerId: string) {
  const defaultColumns = buildDefaultColumnData()

  return prisma.$transaction(async tx => {
    // 1. Reset all settings to defaults
    await tx.boardSettings.update({
      where: { id: settingsId },
      data: {
        isPrivate: false,
        privateOpenAccess: false,
        privateCardRetention: 7,
        isCommentsEnabled: true,
        commentsAnytime: true,
        commentsRestricted: false,
        isMusicEnabled: true,
        musicAnytime: true,
        musicRestricted: false,
        isTimerEnabled: true,
        timerDefault: 300,
        timerRestricted: false,
        isUpvotingEnabled: true,
        upvoteAnytime: true,
        upvoteLimit: -1,
        upvoteRestricted: false,
        isActionItemsEnabled: true,
        actionItemsAnytime: true,
        actionItemsRestricted: false,
        isVotingEnabled: false,
        votingMode: 'MULTI',
        votingLimit: 3,
        votingRestricted: false,
        isDragAndDropEnabled: true,
        cardGroupingEnabled: false,
        aiCardGroupNamingEnabled: false,
        isFacilitatorModeEnabled: false,
        isAiSummaryEnabled: false,
      },
    })

    // 2. Replace columns with standard defaults
    await tx.boardColumn.deleteMany({ where: { boardSettingsId: settingsId } })
    await tx.boardColumn.createMany({
      data: defaultColumns.map(col => ({
        boardSettingsId: settingsId,
        ...col,
      })),
    })

    // 3. Delete invite links
    await tx.boardInvite.deleteMany({ where: { boardSettingsId: settingsId } })

    // 4. Reset all non-owner members to MEMBER
    await tx.boardMember.updateMany({
      where: {
        settingsId,
        userId: { not: ownerId },
      },
      data: { role: BoardRole.MEMBER },
    })

    // Fetch the full updated state for the response
    const [settings, columns] = await Promise.all([
      tx.boardSettings.findUniqueOrThrow({
        where: { id: settingsId },
        include: {
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
        },
      }),
      tx.boardColumn.findMany({
        where: { boardSettingsId: settingsId },
        orderBy: { index: 'asc' },
      }),
    ])

    return { settings, columns }
  })
}

export async function addBoardMember(settingsId: string, newMemberId: string) {
  return prisma.boardMember.create({
    data: {
      userId: newMemberId,
      settingsId,
    },
    select: {
      userId: true,
      role: true,
      permissionMask: true,
      user: {
        select: { id: true, name: true },
      },
      settings: {
        select: { retroSessionId: true },
      },
    },
  })
}
