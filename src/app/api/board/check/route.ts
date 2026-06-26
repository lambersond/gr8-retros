import { type NextRequest, NextResponse } from 'next/server'
import { withUser } from '@/lib/auth-handlers'
import { boardService } from '@/server/board'

export const GET = withUser(async (req: NextRequest) => {
  const params = req.nextUrl.searchParams
  // The query value is already decoded by searchParams; check availability
  // against the raw name so it matches how board ids are stored (see createBoard).
  const boardId = params.get('name')

  const isAvailable = await boardService.checkBoardAvailability(boardId || '')

  return NextResponse.json({ available: isAvailable })
})
