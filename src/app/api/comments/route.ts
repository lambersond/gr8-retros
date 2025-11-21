import { type NextRequest, NextResponse } from 'next/server'
import { withUser } from '@/lib/auth-handlers'
import { commentService } from '@/server/comment'

export const GET = withUser(async (req: NextRequest) => {
  const params = req.nextUrl.searchParams
  const cardId = params.get('cardId')

  const comments = await commentService.getCommentsByCardId(cardId)

  return NextResponse.json(comments)
})

export const POST = withUser(
  async (
    req: NextRequest,
    _unused: any,
    user: { id: string; name: string },
  ) => {
    const body = await req.json()

    const editedCard = await commentService.addComment({
      content: body.content,
      cardId: body.cardId,
      creatorId: user.id,
      creatorName: user.name,
    })

    return NextResponse.json(editedCard)
  },
)

export const PUT = withUser(
  async (
    req: NextRequest,
    _unused: any,
    user: { id: string; name: string },
  ) => {
    const body = await req.json()

    const editedComment = await commentService.updateComment(
      body.id,
      user.id,
      body.content,
    )

    return NextResponse.json(editedComment)
  },
)

export const DELETE = withUser(
  async (
    req: NextRequest,
    _unused: any,
    user: { id: string; name: string },
  ) => {
    const body = await req.json()

    const deletedComment = await commentService.deleteCommentByIdAndCreatorId(
      body.id,
      user.id,
    )

    return NextResponse.json(deletedComment)
  },
)
