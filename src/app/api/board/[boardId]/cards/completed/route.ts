import { type NextRequest, NextResponse } from 'next/server'
import { withUser } from '@/lib/auth-handlers'
import { cardService } from '@/server/card'
import { cardGroupService } from '@/server/card-group'

export const DELETE = withUser(
  async (
    _req: NextRequest,
    {
      params,
    }: {
      params: Promise<{
        boardId: string
      }>
    },
  ) => {
    const { boardId } = await params

    const deletedCards =
      await cardService.deleteCompletedCardsByBoardId(boardId)

    // Disband groups left with 0 or 1 cards after the deletions so a refresh
    // matches the live (optimistic) state on every client.
    await cardGroupService.cleanupSparseCardGroups(boardId)

    return NextResponse.json(deletedCards)
  },
)
