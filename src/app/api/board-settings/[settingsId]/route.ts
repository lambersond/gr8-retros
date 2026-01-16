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

    if ('error' in updatedSettings) {
      return NextResponse.json(updatedSettings, { status: 400 })
    }

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
    const param = await params

    const deletionResult = await boardSettingsService.deleteSettingById(
      param.settingsId,
      user.id,
    )

    if ('error' in deletionResult) {
      return NextResponse.json(deletionResult, { status: 400 })
    }

    return NextResponse.json({ success: true })
  },
)
