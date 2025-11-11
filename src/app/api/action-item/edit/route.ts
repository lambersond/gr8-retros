import { type NextRequest, NextResponse } from 'next/server'
import { withUser } from '@/lib/auth-handlers'
import { actionItemService } from '@/server/action-item'

export const PUT = withUser(async (req: NextRequest) => {
  const body = await req.json()

  const updatedActionItem = await actionItemService.updateActionItemContent(
    body.actionItemId,
    body.content,
  )

  return NextResponse.json(updatedActionItem)
})
