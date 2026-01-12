import { BoardRole } from '@/enums'

export type PermissionKey =
  | 'private'
  | 'private.openAccess'
  | 'private.createLink'
  | 'private.copyLink'
  | 'private.revokeLink'
  | 'private.manageUsers'
  | 'comments'
  | 'comments.anytime'
  | 'music'
  | 'music.anytime'
  | 'timer'
  | 'timer.anytime'
  | 'upvoting'
  | 'upvoting.anytime'
  | 'upvoting.limit'

export const ROLE_HIERARCHY: Record<BoardRole, number> = {
  [BoardRole.VIEWER]: 0,
  [BoardRole.MEMBER]: 1,
  [BoardRole.FACILITATOR]: 2,
  [BoardRole.ADMIN]: 3,
  [BoardRole.OWNER]: 4,
} as const

const PERMISSIONS_MAP: Record<PermissionKey, BoardRole> = {
  private: BoardRole.OWNER,
  'private.openAccess': BoardRole.ADMIN,
  'private.createLink': BoardRole.FACILITATOR,
  'private.copyLink': BoardRole.FACILITATOR,
  'private.revokeLink': BoardRole.FACILITATOR,
  'private.manageUsers': BoardRole.ADMIN,
  comments: BoardRole.ADMIN,
  'comments.anytime': BoardRole.FACILITATOR,
  music: BoardRole.ADMIN,
  'music.anytime': BoardRole.FACILITATOR,
  timer: BoardRole.ADMIN,
  'timer.anytime': BoardRole.FACILITATOR,
  upvoting: BoardRole.ADMIN,
  'upvoting.anytime': BoardRole.FACILITATOR,
  'upvoting.limit': BoardRole.FACILITATOR,
} as const

export function userHasPermission(
  permissionKey: PermissionKey,
  userRole?: BoardRole,
): boolean {
  const requiredRole = PERMISSIONS_MAP[permissionKey]
  return hasMinimumRole(requiredRole, userRole)
}

export function hasMinimumRole(
  minimumRole: BoardRole,
  userRole?: BoardRole,
): boolean {
  if (!userRole) return false
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minimumRole]
}
