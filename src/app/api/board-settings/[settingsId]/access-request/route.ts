import { type NextRequest, NextResponse } from 'next/server'
import { withUser } from '@/lib/auth-handlers'
import { boardAccessRequestService } from '@/server/board-access-request'
import { WithUserUser } from '@/types'

type Context = { params: Promise<{ settingsId: string }> }

// A logged-in non-member requests access to a private board.
export const POST = withUser(
  async (_req: NextRequest, { params }: Context, user: WithUserUser) => {
    const { settingsId } = await params

    const result = await boardAccessRequestService.createAccessRequest(
      settingsId,
      user.id,
    )

    if ('error' in result) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  },
)

// Facilitator+ lists the board's pending and declined requests.
export const GET = withUser(
  async (_req: NextRequest, { params }: Context, user: WithUserUser) => {
    const { settingsId } = await params

    const requests = await boardAccessRequestService.getBoardRequests(
      settingsId,
      user.id,
    )

    return NextResponse.json(requests)
  },
)

// Facilitator+ approves or rejects a request.
export const PUT = withUser(
  async (req: NextRequest, { params }: Context, user: WithUserUser) => {
    const [body, { settingsId }] = await Promise.all([req.json(), params])
    const { requesterUserId, action } = body as {
      requesterUserId: string
      action: 'approve' | 'reject'
    }

    if (action === 'approve') {
      const result = await boardAccessRequestService.approveAccessRequest(
        settingsId,
        requesterUserId,
        user.id,
      )
      return NextResponse.json(result)
    }

    const result = await boardAccessRequestService.rejectAccessRequest(
      settingsId,
      requesterUserId,
      user.id,
    )
    return NextResponse.json(result)
  },
)
