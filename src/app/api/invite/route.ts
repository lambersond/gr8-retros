import { type NextRequest, NextResponse } from 'next/server'
import { withUser } from '@/lib/auth-handlers'
import { boardInviteService } from '@/server/board-invite'

export const POST = withUser(
  async (req: NextRequest, _params, user: { id: string; name: string }) => {
    const { boardSettingsId } = await req.json()
    const invite = await boardInviteService.createBoardInvite(
      boardSettingsId,
      user.id,
    )

    return NextResponse.json(invite)
  },
)
