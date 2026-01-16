import * as repository from './user-repository'
import { userHasPermission, type PermissionKey } from '@/lib/roles'

export async function getBoardPermissions(
  userId: string,
  boardSettingsId: string,
) {
  return repository.getBoardPermissions(userId, boardSettingsId)
}

export async function getUserById(userId: string) {
  return repository.getUserById(userId)
}

export async function getUserOrError(userId: string) {
  const user = await getUserById(userId)
  if (!user) {
    throw new Error('User not found')
  }
  return user
}

export async function checkUserHasPermissionOnBoard(
  userId: string,
  boardSettingsId: string,
  permission: PermissionKey,
) {
  const boardRole = await getUserBoardRole(userId, boardSettingsId)
  return userHasPermission(permission, boardRole)
}

export async function getUserBoardRole(
  userId: string,
  boardSettingsId: string,
) {
  const user = await getUserOrError(userId)

  const boardRole = user.boards
    ? Object.values(user.boards).find(
        board => board.settingsId === boardSettingsId,
      )?.role
    : undefined

  return boardRole
}
