import { subDays } from 'date-fns'
import { boardService } from './board'
import { cardService } from './card'
import { RETENTION_POLICY } from '@/constants'
import { PaymentTier } from '@/enums'

type BoardWithTier = Awaited<
  ReturnType<typeof boardService.getAllTempOrgBoards>
>[number]

export async function dailyCleanup() {
  const allBoards = await boardService.getAllTempOrgBoards()

  const boardsToDelete: string[] = []
  const cardDeletionPromises: Promise<unknown>[] = []

  for (const board of allBoards) {
    const tier = getBoardTier(board)
    const policy = RETENTION_POLICY[tier] || RETENTION_POLICY.UNDEFINED
    const cardRetention =
      board.settings?.privateCardRetention ?? policy.defaultCardDays

    if (shouldDeleteBoard(board.updatedAt, policy.boardDays)) {
      boardsToDelete.push(board.id)
      continue
    }

    cardDeletionPromises.push(
      cardService
        .deleteCompletedCardsOlderThanNDaysByBoardId(board.id, cardRetention)
        .catch(error => {
          console.error(`Failed to clean cards for board ${board.id}:`, error)
        }),
    )
  }

  try {
    await Promise.all(cardDeletionPromises)

    if (boardsToDelete.length > 0) {
      await boardService.deleteManyBoardsByIds(boardsToDelete)
    }
  } catch (error) {
    console.error('Error during daily cleanup:', error)
    throw error
  }
}

function getBoardTier(board: BoardWithTier): PaymentTier | 'UNDEFINED' {
  return board.settings?.members?.[0]?.user?.paymentTier ?? 'UNDEFINED'
}

function shouldDeleteBoard(lastUpdated: Date, retentionDays: number) {
  if (retentionDays === Infinity) return false
  const cutoffDate = subDays(new Date(), retentionDays)
  return lastUpdated < cutoffDate
}
