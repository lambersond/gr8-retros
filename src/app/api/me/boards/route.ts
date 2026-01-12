import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { userService } from '@/server/user'

export async function GET() {
  const session = await auth()

  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await userService.getUserById(userId)
  const boards =
    user?.boards?.map(board => ({
      boardId: board.settings?.retroSessionId,
      settingsId: board.settingsId,
      role: board.role,
    })) || []

  return NextResponse.json(boards)
}
