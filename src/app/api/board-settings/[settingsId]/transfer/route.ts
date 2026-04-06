import { type NextRequest, NextResponse } from 'next/server'
import { withUser } from '@/lib/auth-handlers'
import { boardSettingsService } from '@/server/board-settings'

export const POST = withUser(
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

    const result = await boardSettingsService.transferBoardOwnership(
      param.settingsId,
      body.newOwnerId,
      user.id,
    )

    if ('error' in result) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  },
)
