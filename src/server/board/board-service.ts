'use server'

import * as repository from './board-repository'
import { getSessionUserIdOrCookie } from '@/lib/auth-handlers'

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
