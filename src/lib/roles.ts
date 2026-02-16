import { BoardRole } from '@/enums'

export type PermissionKey =
  | 'private'
  | 'private.retention.cards'
  | 'private.openAccess'
  | 'private.createLink'
  | 'private.copyLink'
  | 'private.revokeLink'
  | 'private.manageUsers'
  | 'comments'
  | 'comments.anytime'
  | 'comments.restricted'
  | 'music'
  | 'music.anytime'
  | 'music.restricted'
  | 'timer'
  | 'timer.default'
  | 'timer.restricted'
  | 'actionItems'
  | 'actionItems.anytime'
  | 'actionItems.restricted'
  | 'upvoting'
  | 'upvoting.anytime'
  | 'upvoting.limit'
  | 'upvoting.restricted'
  | 'voting'
  | 'voting.mode'
  | 'voting.limit'
  | 'voting.restricted'

export type DynamcicPermissionKey =
  | 'music.restricted.canControl'
  | 'timer.restricted.canControl'
  | 'upvoting.restricted.canUpvote'
  | 'actionItems.restricted.canManage'
  | 'actionItems.restricted.canAdd'
  | 'comments.restricted.canComment'

export type BoardPermissions = Record<PermissionKey, boolean> &
  Record<DynamcicPermissionKey, boolean>

// Direct mapping of board settings keys in db to permission keys
export const SETTINGS_ROLE_MAP: Record<string, PermissionKey> = {
  isPrivate: 'private',
  privateOpenAccess: 'private.openAccess',
  privateCardRetention: 'private.retention.cards',
  isCommentsEnabled: 'comments',
  commentsAnytime: 'comments.anytime',
  commentsRestricted: 'comments.restricted',
  isMusicEnabled: 'music',
  musicAnytime: 'music.anytime',
  musicRestricted: 'music.restricted',
  isTimerEnabled: 'timer',
  timerDefault: 'timer.default',
  timerRestricted: 'timer.restricted',
  isActionItemsEnabled: 'actionItems',
  actionItemsRestricted: 'actionItems.restricted',
  isUpvotingEnabled: 'upvoting',
  upvoteAnytime: 'upvoting.anytime',
  upvoteLimit: 'upvoting.limit',
  upvoteRestricted: 'upvoting.restricted',
  isVotingEnabled: 'voting',
  votingMode: 'voting.mode',
  votingLimit: 'voting.limit',
  votingRestricted: 'voting.restricted',
}

export const ROLE_HIERARCHY: Record<BoardRole, number> = {
  [BoardRole.VIEWER]: 0,
  [BoardRole.MEMBER]: 1,
  [BoardRole.FACILITATOR]: 2,
  [BoardRole.ADMIN]: 3,
  [BoardRole.OWNER]: 4,
} as const

const PERMISSIONS_MAP: Record<PermissionKey, BoardRole> &
  Record<DynamcicPermissionKey, BoardRole[]> = {
  private: BoardRole.OWNER,
  'private.retention.cards': BoardRole.ADMIN,
  'private.openAccess': BoardRole.ADMIN,
  'private.createLink': BoardRole.FACILITATOR,
  'private.copyLink': BoardRole.FACILITATOR,
  'private.revokeLink': BoardRole.FACILITATOR,
  'private.manageUsers': BoardRole.ADMIN,
  comments: BoardRole.ADMIN,
  'comments.anytime': BoardRole.FACILITATOR,
  'comments.restricted': BoardRole.FACILITATOR,
  'comments.restricted.canComment': [BoardRole.VIEWER, BoardRole.MEMBER],
  music: BoardRole.ADMIN,
  'music.anytime': BoardRole.FACILITATOR,
  'music.restricted': BoardRole.FACILITATOR,
  'music.restricted.canControl': [BoardRole.VIEWER, BoardRole.FACILITATOR],
  timer: BoardRole.ADMIN,
  'timer.default': BoardRole.FACILITATOR,
  'timer.restricted': BoardRole.FACILITATOR,
  'timer.restricted.canControl': [BoardRole.VIEWER, BoardRole.FACILITATOR],
  actionItems: BoardRole.ADMIN,
  'actionItems.anytime': BoardRole.FACILITATOR,
  'actionItems.restricted': BoardRole.FACILITATOR,
  'actionItems.restricted.canManage': [BoardRole.VIEWER, BoardRole.FACILITATOR],
  'actionItems.restricted.canAdd': [BoardRole.VIEWER, BoardRole.MEMBER],
  upvoting: BoardRole.ADMIN,
  'upvoting.anytime': BoardRole.FACILITATOR,
  'upvoting.limit': BoardRole.FACILITATOR,
  'upvoting.restricted': BoardRole.FACILITATOR,
  'upvoting.restricted.canUpvote': [BoardRole.VIEWER, BoardRole.MEMBER],
  voting: BoardRole.ADMIN,
  'voting.mode': BoardRole.FACILITATOR,
  'voting.limit': BoardRole.FACILITATOR,
  'voting.restricted': BoardRole.FACILITATOR,
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

export function hasMinimumDynamicPermissionRoles(
  index: number,
  permissionKey: DynamcicPermissionKey,
  userRole?: BoardRole,
) {
  const minPerm = PERMISSIONS_MAP[permissionKey][index]
  return hasMinimumRole(minPerm, userRole)
}
