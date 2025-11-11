import { type NextRequest, NextResponse } from 'next/server'
import { withUser } from '@/lib/auth-handlers'
import { cardService } from '@/server/card'

export const PUT = withUser(
  async (
    req: NextRequest,
    _unused: any,
    user: { id: string; name: string },
  ) => {
    const body = await req.json()

    const editedCard = await cardService.editCardContent({
      newContent: body.content,
      cardId: body.cardId,
      userId: user.id,
    })

    return NextResponse.json(editedCard)
  },
)
