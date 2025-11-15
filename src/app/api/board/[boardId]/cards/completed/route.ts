import { type NextRequest, NextResponse } from 'next/server'
import { withUser } from '@/lib/auth-handlers'
import { cardService } from '@/server/card'

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

    return NextResponse.json(deletedCards)
  },
)
