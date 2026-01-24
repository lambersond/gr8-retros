import { type NextRequest, NextResponse } from 'next/server'
import { withUser } from '@/lib/auth-handlers'
import { actionItemService } from '@/server/action-item'

export const DELETE = withUser(async (req: NextRequest) => {
  const body = await req.json()

  await actionItemService.deleteOwnActionItem(body.actionItemId, body.userId)

  return NextResponse.json({ id: body.actionItemId })
})
