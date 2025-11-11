import { type NextRequest, NextResponse } from 'next/server'
import { withUser } from '@/lib/auth-handlers'
import { cardService } from '@/server/card'

export const POST = withUser(async (req: NextRequest) => {
  const body = await req.json()

  const markDiscussedCard = await cardService.markCardDiscussed({
    cardId: body.cardId,
    isDiscussed: body.isDiscussed,
  })

  return NextResponse.json(markDiscussedCard)
})
