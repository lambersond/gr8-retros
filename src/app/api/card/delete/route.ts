import { type NextRequest, NextResponse } from 'next/server'
import { withUser } from '@/lib/auth-handlers'
import { cardService } from '@/server/card'

export const DELETE = withUser(async (req: NextRequest) => {
  const body = await req.json()

  const deletedCard = await cardService.deleteCardById(body.cardId)

  return NextResponse.json(deletedCard)
})
