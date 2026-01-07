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

    const updatedSettings = await boardSettingsService.updateSettingById(
      param.settingsId,
      user.id,
      body,
    )

    return NextResponse.json(updatedSettings)
  },
)
