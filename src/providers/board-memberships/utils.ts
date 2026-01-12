import { CACHE_DURATION } from './constants'
import { hasMinimumRole } from '@/lib/roles'
import type { BoardMembershipData } from './types'
import type { BoardRole } from '@/enums'

export function isCacheValid(lastFetch: number) {
  return Date.now() - lastFetch < CACHE_DURATION
}

export function getRoleFromBoards(
  boards: BoardMembershipData[],
  boardId: string,
): BoardRole | undefined {
  return boards.find(b => b.boardId === boardId)?.role
}

export function getSettingsIdFromBoards(
  boards: BoardMembershipData[],
  boardId: string,
) {
  return boards.find(b => b.boardId === boardId)?.settingsId
}

export function checkHasRole(
  boards: BoardMembershipData[],
  boardId: string,
  minimumRole: BoardRole,
) {
  const userRole = getRoleFromBoards(boards, boardId)
  if (!userRole) return false

  return hasMinimumRole(minimumRole, userRole)
}

export function findBoardInCache(
  boards: BoardMembershipData[],
  boardId: string,
) {
  return boards.find(b => b.boardId === boardId)
}
