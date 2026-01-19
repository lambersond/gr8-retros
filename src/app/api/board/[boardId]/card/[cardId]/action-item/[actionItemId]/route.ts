import { type NextRequest, NextResponse } from 'next/server'
import { withUser } from '@/lib/auth-handlers'
import { actionItemService } from '@/server/action-item'

export const PUT = withUser(
  async (req: NextRequest, { params }: { params: Promise<any> }) => {
    const [body, paramsSettled] = await Promise.all([req.json(), params])

    const { boardId, cardId, actionItemId } = paramsSettled

    const updatedActionItem = await actionItemService.updateActionItemContent({
      boardId,
      cardId,
      actionItemId,
      patch: body,
    })

    return NextResponse.json(updatedActionItem)
  },
)
