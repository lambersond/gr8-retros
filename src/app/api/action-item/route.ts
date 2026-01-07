import { type NextRequest, NextResponse } from 'next/server'
import { withUser } from '@/lib/auth-handlers'
import { actionItemService } from '@/server/action-item'
import type { WithUserUser } from '@/types'

export const POST = withUser(
  async (req: NextRequest, _unused: any, user: WithUserUser) => {
    const body = await req.json()

    const newActionItem = await actionItemService.createActionItem({
      cardId: body.cardId,
      content: body.content,
      createdBy: user.name || 'Anonymous',
    })

    return NextResponse.json(newActionItem)
  },
)
