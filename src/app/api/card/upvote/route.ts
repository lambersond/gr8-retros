import { type NextRequest, NextResponse } from 'next/server'
import { withUser } from '@/lib/auth-handlers'
import { cardService } from '@/server/card'

export const POST = withUser(
  async (
    req: NextRequest,
    _unused: any,
    user: { id: string; name: string },
  ) => {
    const body = await req.json()

    const upvoteCard = await cardService.upvoteCard({
      cardId: body.cardId,
      userId: user.id,
    })

    return NextResponse.json(upvoteCard)
  },
)
