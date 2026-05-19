import { type NextRequest, NextResponse } from 'next/server'
import { withUser } from '@/lib/auth-handlers'
import { boardService } from '@/server/board'

export const PUT = withUser(
  async (
    req: NextRequest,
    {
      params,
    }: {
      params: Promise<{ boardId: string }>
    },
    user: { id: string },
  ) => {
    const [body, param] = await Promise.all([req.json(), params])

    if (typeof body?.name !== 'string' || typeof body?.settingsId !== 'string') {
      return NextResponse.json(
        { error: 'INVALID_REQUEST', message: 'Missing name or settingsId' },
        { status: 400 },
      )
    }

    const result = await boardService.updateBoardName(
      param.boardId,
      body.settingsId,
      user.id,
      body.name,
    )

    if ('error' in result) {
      const status = result.error === 'INSUFFICIENT_PERMISSIONS' ? 403 : 400
      return NextResponse.json(result, { status })
    }

    return NextResponse.json(result)
  },
)
