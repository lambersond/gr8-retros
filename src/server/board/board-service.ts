'use server'

import * as repository from './board-repository'
import { getSessionUserIdOrCookie } from '@/lib/auth-handlers'

export async function getBoardById(id: string) {
  const userId = await getSessionUserIdOrCookie()

  const board = await repository.getOrCreateBoardByIdAndUserId(id, userId)

  return {
    authorized: !!board,
    board,
  }
}
