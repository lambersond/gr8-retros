import { type NextRequest, NextResponse } from 'next/server'
import { withUser } from '@/lib/auth-handlers'
import { boardService } from '@/server/board'
import type { WithUserUser } from '@/types'

export const POST = withUser(
  async (req: NextRequest, _: any, user: WithUserUser) => {
    const body = await req.json()

    const newBoard = await boardService.createBoard({
      boardName: body.boardName,
      ownerId: user.id,
    })

    return NextResponse.json(newBoard)
  },
)
