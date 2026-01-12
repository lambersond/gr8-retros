import { type NextRequest, NextResponse } from 'next/server'
import { withUser } from '@/lib/auth-handlers'
import { boardSettingsService } from '@/server/board-settings'

export const PUT = withUser(
  async (
    req: NextRequest,
    {
      params,
    }: {
      params: Promise<{
        settingsId: string
      }>
    },
    user: { id: string },
  ) => {
    const [body, param] = await Promise.all([req.json(), params])

    const updatedSettings = await boardSettingsService.updateBoardMemberRole(
      param.settingsId,
      body.memberUserId,
      body.newRole,
      user.id,
    )

    return NextResponse.json(updatedSettings)
  },
)

export const DELETE = withUser(
  async (
    req: NextRequest,
    {
      params,
    }: {
      params: Promise<{
        settingsId: string
      }>
    },
    user: { id: string },
  ) => {
    const [body, param] = await Promise.all([req.json(), params])

    await boardSettingsService.removeBoardMember(
      param.settingsId,
      body.memberUserId,
      user.id,
    )

    return NextResponse.json({ userId: body.memberUserId })
  },
)
