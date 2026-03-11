import { type NextRequest, NextResponse } from 'next/server'
import { withUser } from '@/lib/auth-handlers'
import { boardService } from '@/server/board'

export const GET = withUser(async (req: NextRequest) => {
  const params = req.nextUrl.searchParams
  const boardId = params.get('name')
  const encodedBoardId = encodeURIComponent(boardId || '')

  const isAvailable = await boardService.checkBoardAvailability(encodedBoardId)

  return NextResponse.json({ available: isAvailable })
})
