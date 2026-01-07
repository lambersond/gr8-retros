import { type NextRequest, NextResponse } from 'next/server'
import { withUser } from '@/lib/auth-handlers'
import { cardService } from '@/server/card'
import type { WithUserUser } from '@/types'

export const POST = withUser(
  async (
    req: NextRequest,
    {
      params,
    }: {
      params: Promise<{
        boardId: string
      }>
    },
    user: WithUserUser,
  ) => {
    const [body, param] = await Promise.all([req.json(), params])

    const newCard = await cardService.createCard({
      boardId: param.boardId,
      content: body.content,
      column: body.type,
      creatorId: user.id,
      creatorName: user.name,
    })

    return NextResponse.json(newCard)
  },
)
