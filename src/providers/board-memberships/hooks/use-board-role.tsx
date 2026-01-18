import { useParams } from 'next/navigation'
import { useBoardMemberships } from './use-board-memberships'
import { BoardRole } from '@/enums'
import { useBoardPermissions } from '@/providers/retro-board/board-settings'

export function useBoardRole() {
  const { id: boardId } = useParams()
  const { boards } = useBoardMemberships()
  const { user } = useBoardPermissions()
  const board = boards.find(b => b.boardId === boardId)

  return {
    role: board?.role ?? BoardRole.VIEWER,
    ...user,
  }
}
