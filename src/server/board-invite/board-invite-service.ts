'use server'

import { userService } from '../user'
import * as repository from './board-invite-repository'
import { userHasPermission } from '@/lib/roles'
import { BoardRole } from '@/types'

export async function acceptBoardInvite(inviteCode: string, userId: string) {
  return repository.joinBoardByInviteCode(inviteCode, userId)
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
  userBoards:
    | Record<string, { settingsId: string; role: BoardRole }>
    | undefined,
) {
  const userBoardRole = userBoards
    ? Object.values(userBoards).find(
        board => board.settingsId === boardSettingsId,
      )?.role
    : undefined
  const hasPerm = userHasPermission('private.revokeLink', userBoardRole)

  if (!hasPerm) {
    throw new Error('User does not have permission to delete board invites')
  }

  return repository.deleteBoardInviteByBoardSettingsId(boardSettingsId)
}
