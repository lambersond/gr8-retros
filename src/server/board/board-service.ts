'use server'

import * as repository from './board-repository'
import { BoardRole } from '@/enums'
import { getSessionUserIdOrCookie } from '@/lib/auth-handlers'
import { hasMinimumRole } from '@/lib/roles'
import { userService } from '@/server/user'
import type { CreateBoardProps } from './types'

export async function getBoardById(id: string) {
  const userId = await getSessionUserIdOrCookie()
  const board = await repository.getOrCreateBoardById(id)

  const boardTier = board.settings?.members.find(
    member => member.role === 'OWNER',
  )?.user.paymentTier

  if (board.settings?.isPrivate && !board.settings.privateOpenAccess) {
    const isMember =
      board.settings.ownerId === userId ||
      board.settings?.members.some(member => member?.user.id === userId)

    if (!isMember) {
      return {
        authorized: false,
        board: undefined,
      }
    }
  }

  if (board.settings) (board.settings as any).boardTier = boardTier

  return {
    authorized: !!board,
    boardTier: boardTier,
    board,
  }
}

export async function deleteBoardsOlderThanNDays(days = 30) {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)
  return repository.deleteBoardsOlderThanDate(cutoffDate)
}

export async function getAllTempOrgBoards() {
  return repository.getAllTempOrgBoards()
}

export async function deleteManyBoardsByIds(boardIds: string[]) {
  return repository.deleteManyBoardsByIds(boardIds)
}

export async function checkBoardAvailability(boardId: string) {
  const existingBoard = await repository.getBoardByName(boardId)
  return !existingBoard
}

export async function createBoard(data: CreateBoardProps) {
  return repository.createBoard(data)
}

export async function updateBoardName(
  boardId: string,
  settingsId: string,
  userId: string,
  name: string,
) {
  const trimmed = name.trim()
  if (!trimmed) {
    return { error: 'INVALID_NAME', message: 'Board name cannot be empty' }
  }

  const userBoardRole = await userService.getUserBoardRole(userId, settingsId)
  if (!hasMinimumRole(BoardRole.ADMIN, userBoardRole)) {
    return {
      error: 'INSUFFICIENT_PERMISSIONS',
      message: 'User does not have permission to rename this board',
    }
  }

  try {
    const updated = await repository.updateBoardName(boardId, trimmed)
    return { name: updated.name }
  } catch {
    return { error: 'UPDATE_FAILED', message: 'Failed to update board name' }
  }
}
