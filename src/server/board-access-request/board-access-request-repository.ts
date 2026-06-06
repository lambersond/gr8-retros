/* eslint-disable camelcase -- Prisma composite-key arg `userId_settingsId` */
'use server'

import prisma from '@/clients/prisma'
import { AccessRequestStatus, BoardRole } from '@/enums'

const MANAGER_ROLES = [BoardRole.FACILITATOR, BoardRole.ADMIN, BoardRole.OWNER]

const requesterSelect = {
  status: true,
  createdAt: true,
  user: { select: { id: true, name: true, image: true } },
} as const

export async function getBoardSettingsAccess(settingsId: string) {
  return prisma.boardSettings.findUnique({
    where: { id: settingsId },
    select: {
      isPrivate: true,
      privateOpenAccess: true,
      retroSessionId: true,
      ownerId: true,
      members: { select: { userId: true } },
    },
  })
}

export async function getAccessRequest(settingsId: string, userId: string) {
  return prisma.boardAccessRequest.findUnique({
    where: { userId_settingsId: { userId, settingsId } },
    select: { status: true },
  })
}

export async function createAccessRequest(settingsId: string, userId: string) {
  return prisma.boardAccessRequest.create({
    data: { settingsId, userId, status: AccessRequestStatus.PENDING },
  })
}

export async function getRequestsBySettings(settingsId: string) {
  return prisma.boardAccessRequest.findMany({
    where: { settingsId },
    orderBy: { createdAt: 'asc' },
    select: requesterSelect,
  })
}

export async function setRequestStatus(
  settingsId: string,
  userId: string,
  status: AccessRequestStatus,
) {
  return prisma.boardAccessRequest.update({
    where: { userId_settingsId: { userId, settingsId } },
    data: { status },
    select: { settings: { select: { retroSessionId: true } } },
  })
}

// Approve: become a MEMBER and drop the request row, atomically.
export async function approveRequest(settingsId: string, userId: string) {
  const [member] = await prisma.$transaction([
    prisma.boardMember.upsert({
      where: { userId_settingsId: { userId, settingsId } },
      create: { userId, settingsId, role: BoardRole.MEMBER },
      update: {},
      select: {
        role: true,
        permissionMask: true,
        user: { select: { id: true, name: true, image: true } },
        settings: { select: { retroSessionId: true } },
      },
    }),
    prisma.boardAccessRequest.delete({
      where: { userId_settingsId: { userId, settingsId } },
    }),
  ])
  return member
}

// Pending requests on boards where this user is facilitator+ (or owner).
export async function getActionableRequests(userId: string) {
  return prisma.boardAccessRequest.findMany({
    where: {
      status: AccessRequestStatus.PENDING,
      settings: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId, role: { in: MANAGER_ROLES } } } },
        ],
      },
    },
    orderBy: { createdAt: 'asc' },
    select: {
      status: true,
      createdAt: true,
      settingsId: true,
      user: { select: { id: true, name: true, image: true } },
      settings: {
        select: {
          retroSessionId: true,
          retroSession: { select: { name: true } },
        },
      },
    },
  })
}

export async function getUserPendingRequests(userId: string) {
  return prisma.boardAccessRequest.findMany({
    where: { userId, status: AccessRequestStatus.PENDING },
    orderBy: { createdAt: 'asc' },
    select: {
      status: true,
      createdAt: true,
      settings: {
        select: {
          retroSessionId: true,
          retroSession: { select: { name: true } },
        },
      },
    },
  })
}
