import { type NextRequest, NextResponse } from 'next/server'
import { withUser } from '@/lib/auth-handlers'
import { boardInviteService } from '@/server/board-invite'
import type { WithUserUser } from '@/types'

export const DELETE = withUser(
  async (
    _req: NextRequest,
    {
      params,
    }: {
      params: Promise<{
        settingsId: string
      }>
    },
    user: WithUserUser,
  ) => {
    const { settingsId } = await params

    await boardInviteService.deleteInviteByBoardSettingsId(
      settingsId,
      user.boards,
    )

    return NextResponse.json({ success: true })
  },
)
