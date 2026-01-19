import { type NextRequest, NextResponse } from 'next/server'
import { withUser } from '@/lib/auth-handlers'
import { actionItemService } from '@/server/action-item'
import type { WithUserUser } from '@/types'

export const POST = withUser(
  async (
    req: NextRequest,
    {
      params,
    }: {
      params: Promise<{
        boardId: string
        cardId: string
      }>
    },
    user: WithUserUser,
  ) => {
    const [body, { boardId, cardId }] = await Promise.all([req.json(), params])

    const newActionItem = await actionItemService.createActionItem({
      boardId,
      item: {
        cardId,
        content: body.content,
        assignedToId: body.assignedToId,
        createdBy: user.name || 'Anonymous',
      },
    })

    return NextResponse.json(newActionItem)
  },
)
