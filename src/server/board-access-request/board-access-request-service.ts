'use server'

import { userService } from '../user'
import * as repository from './board-access-request-repository'
import { AccessRequestStatus } from '@/enums'
import { publishMessageToChannel } from '@/lib/ably'

export type RequestStatus = 'NONE' | 'PENDING' | 'REJECTED'

async function assertCanManage(userId: string, settingsId: string) {
  const hasPermission = await userService.checkUserHasPermissionOnBoard(
    userId,
    settingsId,
    'private.manageRequests',
  )
  if (!hasPermission) {
    throw new Error(
      'User does not have permission to manage board access requests',
    )
  }
}

// Lets clients on the board channel know to refetch the request list/counts.
async function publishAccessRequestsChanged(retroSessionId: string) {
  await publishMessageToChannel(retroSessionId, {
    name: 'members-updated',
    data: { type: 'ACCESS_REQUESTS_CHANGED' },
  })
}

// Notifies the requester (who isn't on the board channel) on their own channel
// so their pending screen / personal page can react to the decision live.
async function publishAccessRequestResolved(
  requesterId: string,
  boardId: string,
  type: 'ACCESS_REQUEST_APPROVED' | 'ACCESS_REQUEST_REJECTED',
) {
  await publishMessageToChannel(`access-requests:${requesterId}`, {
    name: 'access-request-resolved',
    data: { type, boardId },
  })
}

export async function getUserRequestStatus(
  userId: string | undefined,
  settingsId: string,
): Promise<RequestStatus> {
  if (!userId) return 'NONE'
  const request = await repository.getAccessRequest(settingsId, userId)
  return request ? (request.status as RequestStatus) : 'NONE'
}

export async function createAccessRequest(settingsId: string, userId: string) {
  const access = await repository.getBoardSettingsAccess(settingsId)
  if (!access) {
    return { error: 'NOT_FOUND', message: 'Board not found' }
  }
  if (!access.isPrivate || access.privateOpenAccess) {
    return {
      error: 'NOT_PRIVATE',
      message: 'This board does not require an access request',
    }
  }

  const isMember =
    access.ownerId === userId ||
    access.members.some(member => member.userId === userId)
  if (isMember) {
    return { error: 'ALREADY_MEMBER', message: 'You are already a member' }
  }

  // A PENDING request is a no-op; a REJECTED one blocks re-asking.
  const existing = await repository.getAccessRequest(settingsId, userId)
  if (existing) {
    return {
      error: 'ALREADY_REQUESTED',
      message: 'You already have a request for this board',
    }
  }

  await repository.createAccessRequest(settingsId, userId)
  await publishAccessRequestsChanged(access.retroSessionId)
  return { status: 'PENDING' as const }
}

export async function getBoardRequests(settingsId: string, userId: string) {
  await assertCanManage(userId, settingsId)
  const all = await repository.getRequestsBySettings(settingsId)
  return {
    pending: all.filter(r => r.status === AccessRequestStatus.PENDING),
    declined: all.filter(r => r.status === AccessRequestStatus.REJECTED),
  }
}

export async function approveAccessRequest(
  settingsId: string,
  requesterId: string,
  actingUserId: string,
) {
  await assertCanManage(actingUserId, settingsId)
  const member = await repository.approveRequest(settingsId, requesterId)
  await publishMessageToChannel(member.settings.retroSessionId, {
    name: 'members-updated',
    data: {
      type: 'NEW_MEMBER_ADDED',
      payload: {
        user: member.user,
        permissionMask: Number(member.permissionMask),
        role: member.role,
      },
    },
  })
  await publishAccessRequestsChanged(member.settings.retroSessionId)
  await publishAccessRequestResolved(
    requesterId,
    member.settings.retroSessionId,
    'ACCESS_REQUEST_APPROVED',
  )
  return { user: member.user, role: member.role }
}

export async function rejectAccessRequest(
  settingsId: string,
  requesterId: string,
  actingUserId: string,
) {
  await assertCanManage(actingUserId, settingsId)
  const updated = await repository.setRequestStatus(
    settingsId,
    requesterId,
    AccessRequestStatus.REJECTED,
  )
  await publishAccessRequestsChanged(updated.settings.retroSessionId)
  await publishAccessRequestResolved(
    requesterId,
    updated.settings.retroSessionId,
    'ACCESS_REQUEST_REJECTED',
  )
  return { success: true }
}

export async function getActionableRequests(userId: string) {
  return repository.getActionableRequests(userId)
}

export async function getUserPendingRequests(userId: string) {
  return repository.getUserPendingRequests(userId)
}
