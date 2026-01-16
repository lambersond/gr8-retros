'use server'

import { userService } from '../user'
import * as repository from './board-settings-repository'
import { MAX_BOARDS_PER_SUBSCRIPTION } from '@/constants'
import { BoardRole } from '@/enums'
import { publishMessageToChannel } from '@/lib/ably'
import { SETTINGS_ROLE_MAP, userHasPermission } from '@/lib/roles'

export async function updateSettingById(
  id: string,
  userId: string,
  patch: Record<keyof typeof SETTINGS_ROLE_MAP, any>,
) {
  const userBoardRole = await userService.getUserBoardRole(userId, id)

  for (const key of Object.keys(patch)) {
    const permissionKey = SETTINGS_ROLE_MAP[key]
    if (!userHasPermission(permissionKey, userBoardRole)) {
      return {
        error: 'INSUFFICIENT_PERMISSIONS',
        message: 'User does not have permission to update settings',
      }
    }
  }

  try {
    const newSettings = await repository.updateSettingById(id, userId, patch)
    return newSettings
  } catch {
    return {
      error: 'UPDATE_FAILED',
      message: 'Failed to update board settings',
    }
  }
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

export async function deleteSettingById(settingsId: string, userId: string) {
  const boardRole = await userService.getUserBoardRole(userId, settingsId)

  if (boardRole !== BoardRole.OWNER) {
    return {
      error: 'INSUFFICIENT_PERMISSIONS',
      message: 'Only board owners can delete the board',
    }
  }
  try {
    await repository.deleteBoardSettingById(settingsId, userId)
    return { success: true }
  } catch {
    return {
      error: 'DELETE_FAILED',
      message: 'Failed to delete board settings',
    }
  }
}
