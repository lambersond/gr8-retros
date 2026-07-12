import { useBoardPermissions } from '@/providers/retro-board/board-settings'

// The role is read from the board's own member list rather than the memberships
// cache: the cache is TTL'd and can still be empty for a member who was just
// admitted, which made them broadcast their presence as a VIEWER.
export function useBoardRole() {
  const { user, userRole } = useBoardPermissions()

  return {
    role: userRole,
    ...user,
  }
}
