import { type NextRequest, NextResponse } from 'next/server'
import { withUser } from '@/lib/auth-handlers'
import { cardService } from '@/server/card'

export const DELETE = withUser(
  async (
    req: NextRequest,
    {
      params,
    }: {
      params: Promise<{
        boardId: string
      }>
    },
  ) => {
    const { boardId } = await params

    const deletedCards = await cardService.deleteCardsByBoardId(boardId)

    return NextResponse.json(deletedCards)
  },
)
