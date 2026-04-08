import { type NextRequest, NextResponse } from 'next/server'
import { withUser } from '@/lib/auth-handlers'
import { boardSettingsService } from '@/server/board-settings'

export const POST = withUser(
  async (
    _req: NextRequest,
    {
      params,
    }: {
      params: Promise<{
        settingsId: string
      }>
    },
    user: { id: string },
  ) => {
    const param = await params

    const result = await boardSettingsService.resetBoardSettings(
      param.settingsId,
      user.id,
    )

    if ('error' in result) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  },
)
