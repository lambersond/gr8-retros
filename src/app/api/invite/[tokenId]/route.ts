import { type NextRequest, NextResponse } from 'next/server'
import { withUser } from '@/lib/auth-handlers'
import { boardInviteService } from '@/server/board-invite'

export const GET = withUser(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ tokenId: string }> },
    user: { id: string; name: string },
  ) => {
    const { tokenId } = await params

    const boardId = await boardInviteService.acceptBoardInvite(tokenId, user.id)
    const redirectUrl = `/retro/${boardId}`

    return NextResponse.redirect(new URL(redirectUrl, req.url))
  },
)
