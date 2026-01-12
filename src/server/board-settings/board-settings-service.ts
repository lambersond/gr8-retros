'use server'

import { userService } from '../user'
import * as repository from './board-settings-repository'
import { MAX_BOARDS_PER_SUBSCRIPTION } from '@/constants'
import { BoardRole } from '@/enums'
import { publishMessageToChannel } from '@/lib/ably'

export async function updateSettingById(
  id: string,
  userId: string,
  patch: Record<string, any>,
) {
  return repository.updateSettingById(id, userId, patch)
}

export async function claimBoardSettings(settingsId: string, userId: string) {
  const user = await userService.getUserById(userId)
  if (!user) {
    throw new Error('User not found')
  }

  const ownedBoardsCount = user.boards.filter(
    board => board.role === BoardRole.OWNER,
  ).length

  if (ownedBoardsCount >= MAX_BOARDS_PER_SUBSCRIPTION[user.paymentTier]) {
    return {
      error: 'BOARD_LIMIT_REACHED',
      message: 'You have reached the limit of private boards for your plan.',
    }
  }
  return repository.claimBoardSettings(settingsId, userId)
}

export async function updateBoardMemberRole(
  settingsId: string,
  memberUserId: string,
  newRole: BoardRole,
  userId: string,
) {
  await userCanManageBoardUsers(userId, settingsId)
  const updatedMember = await repository.updateBoardMemberRole(
    settingsId,
    memberUserId,
    newRole,
  )
  await publishMessageToChannel(updatedMember.settings.retroSessionId, {
    name: 'members-updated',
    data: {
      type: 'UPDATE_MEMBER_ROLE',
      payload: {
        userId: memberUserId,
        newRole,
      },
    },
  })
  return updatedMember
}

export async function removeBoardMember(
  settingsId: string,
  memberUserId: string,
  userId: string,
) {
  await userCanManageBoardUsers(userId, settingsId)
  const removedUser = await repository.removeBoardMember(
    settingsId,
    memberUserId,
  )
  await publishMessageToChannel(removedUser.settings.retroSessionId, {
    name: 'members-updated',
    data: {
      type: 'MEMBER_REMOVED',
      payload: {
        userId: memberUserId,
      },
    },
  })
  return removedUser
}

async function userCanManageBoardUsers(userId: string, settingsId: string) {
  const hasPermission = await userService.checkUserHasPermissionOnBoard(
    userId,
    settingsId,
    'private.manageUsers',
  )

  if (!hasPermission) {
    throw new Error('User does not have permission to manage board users')
  }

  return hasPermission
}
