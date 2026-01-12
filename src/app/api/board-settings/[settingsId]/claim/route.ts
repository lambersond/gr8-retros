import { type NextRequest, NextResponse } from 'next/server'
import { withUser } from '@/lib/auth-handlers'
import { boardSettingsService } from '@/server/board-settings'

export const PUT = withUser(
  async (
    _req: NextRequest,
    {
      params,
    }: {
      params: Promise<{
        settingsId: string
      }>
    },
    user: { id: string; name: string },
  ) => {
    const param = await params
    const userId = user.id

    const settings = await boardSettingsService.claimBoardSettings(
      param.settingsId,
      userId,
    )

    if ('error' in settings) {
      return NextResponse.json(
        { error: settings.error, message: settings.message },
        { status: 400 },
      )
    }

    return NextResponse.json(settings)
  },
)
