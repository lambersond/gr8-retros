'use server'

import { userService } from '../user'
import * as repository from './board-invite-repository'
import { publishMessageToChannel } from '@/lib/ably'
import { userHasPermission } from '@/lib/roles'

export async function acceptBoardInvite(inviteCode: string, userId: string) {
  const { boardId, member } = await repository.joinBoardByInviteCode(
    inviteCode,
    userId,
  )

  const memberData = {
    ...member,
    permissionMask: Number(member.permissionMask),
  }

  await publishMessageToChannel(boardId, {
    name: 'user-joined',
    data: {
      type: 'NEW_MEMBER_ADDED',
      payload: memberData,
    },
  })

  return boardId
}

export async function getBoardInviteByToken(token: string) {
  return repository.getBoardInviteByToken(token)
}

export async function createBoardInvite(
  boardSettingsId: string,
  userId: string,
  expiresAt?: Date | null,
) {
  const resp = await userService.getBoardPermissions(userId, boardSettingsId)
  const hasPerm = userHasPermission('private.createLink', resp?.boards[0]?.role)

  if (!hasPerm) {
    throw new Error('User does not have permission to create board invites')
  }

  return repository.createBoardInvite(boardSettingsId, expiresAt)
}

export async function deleteInviteByBoardSettingsId(
  boardSettingsId: string,
  userId: string,
) {
  const user = await userService.getUserById(userId)
  if (!user) {
    throw new Error('User not found')
  }

  const userBoardRole = user.boards
    ? Object.values(user.boards).find(
        board => board.settingsId === boardSettingsId,
      )?.role
    : undefined
  const hasPerm = userHasPermission('private.revokeLink', userBoardRole)

  if (!hasPerm) {
    throw new Error('User does not have permission to delete board invites')
  }

  return repository.deleteBoardInviteByBoardSettingsId(boardSettingsId)
}
