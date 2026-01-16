import { Clock, MessageSquare, Music, ThumbsUp, UserLock } from 'lucide-react'
import { BASE_SETTINGS } from './constants'
import {
  type BoardPermissions,
  type DynamcicPermissionKey,
  hasMinimumDynamicPermissionRoles,
  hasMinimumRole,
  type PermissionKey,
  userHasPermission,
} from '@/lib/roles'
import type { BoardSettingsWithPermissions } from './types'
import type { BoardRole } from '@/enums'
import type { BoardSettings } from '@/types'

const getBaseSettings = (): BoardSettingsWithPermissions => {
  const baseSettings = structuredClone(BASE_SETTINGS) as any

  baseSettings.private.icon = UserLock
  baseSettings.comments.icon = MessageSquare
  baseSettings.music.icon = Music
  baseSettings.timer.icon = Clock
  baseSettings.upvoting.icon = ThumbsUp

  return baseSettings
}

export function getSettingsWithPermissions(
  settings: BoardSettings,
  userRole: BoardRole,
) {
  const baseSettings = getBaseSettings()

  baseSettings.private.enabled = settings.isPrivate
  baseSettings.private.canEdit = userHasPermission('private', userRole)
  baseSettings.private.subsettings.openAccess.enabled =
    settings.privateOpenAccess
  baseSettings.private.subsettings.openAccess.canEdit = userHasPermission(
    'private.openAccess',
    userRole,
  )

  baseSettings.comments.enabled = settings.isCommentsEnabled
  baseSettings.comments.canEdit = userHasPermission('comments', userRole)
  baseSettings.comments.subsettings.anytime.enabled = settings.commentsAnytime
  baseSettings.comments.subsettings.anytime.canEdit = userHasPermission(
    'comments.anytime',
    userRole,
  )

  baseSettings.music.enabled = settings.isMusicEnabled
  baseSettings.music.canEdit = userHasPermission('music', userRole)
  baseSettings.music.subsettings.anytime.enabled = settings.musicAnytime
  baseSettings.music.subsettings.anytime.canEdit = userHasPermission(
    'music.anytime',
    userRole,
  )
  baseSettings.music.subsettings.restricted.enabled = settings.musicRestricted
  baseSettings.music.subsettings.restricted.canEdit = userHasPermission(
    'music.restricted',
    userRole,
  )

  baseSettings.timer.enabled = settings.isTimerEnabled
  baseSettings.timer.canEdit = userHasPermission('timer', userRole)
  baseSettings.timer.subsettings.anytime.enabled = settings.timerAnytime
  baseSettings.timer.subsettings.anytime.canEdit = userHasPermission(
    'timer.anytime',
    userRole,
  )
  baseSettings.timer.subsettings.restricted.enabled = settings.timerRestricted
  baseSettings.timer.subsettings.restricted.canEdit = userHasPermission(
    'timer.restricted',
    userRole,
  )

  baseSettings.upvoting.enabled = settings.isUpvotingEnabled
  baseSettings.upvoting.canEdit = userHasPermission('upvoting', userRole)
  baseSettings.upvoting.subsettings.anytime.enabled = settings.upvoteAnytime
  baseSettings.upvoting.subsettings.anytime.canEdit = userHasPermission(
    'upvoting.anytime',
    userRole,
  )
  baseSettings.upvoting.subsettings.limit.value = settings.upvoteLimit
  baseSettings.upvoting.subsettings.limit.canEdit = userHasPermission(
    'upvoting.limit',
    userRole,
  )
  baseSettings.upvoting.subsettings.restricted.enabled =
    settings.upvoteRestricted
  baseSettings.upvoting.subsettings.restricted.canEdit = userHasPermission(
    'upvoting.restricted',
    userRole,
  )

  return baseSettings
}

export function getUserBoardPermissions(
  userRole: BoardRole,
  settings?: BoardSettings,
): BoardPermissions {
  const staticPermissions = getStaticBoardPermissions(userRole)
  if (settings) {
    const dynamicPermissions = getDynamicBoardPermissions(userRole, settings)
    return {
      ...staticPermissions,
      ...dynamicPermissions,
    }
  }
  return {
    ...staticPermissions,
    'music.restricted.canControl': false,
    'timer.restricted.canControl': false,
    'upvoting.restricted.canUpvote': false,
  }
}

function getStaticBoardPermissions(userRole: BoardRole) {
  return {
    private: userHasPermission('private', userRole),
    'private.openAccess': userHasPermission('private.openAccess', userRole),
    'private.createLink': userHasPermission('private.createLink', userRole),
    'private.copyLink': userHasPermission('private.copyLink', userRole),
    'private.revokeLink': userHasPermission('private.revokeLink', userRole),
    'private.manageUsers': userHasPermission('private.manageUsers', userRole),
    'private.retention.cards': userHasPermission(
      'private.retention.cards',
      userRole,
    ),
    comments: userHasPermission('comments', userRole),
    'comments.anytime': userHasPermission('comments.anytime', userRole),
    music: userHasPermission('music', userRole),
    'music.anytime': userHasPermission('music.anytime', userRole),
    'music.restricted': userHasPermission('music.restricted', userRole),
    timer: userHasPermission('timer', userRole),
    'timer.anytime': userHasPermission('timer.anytime', userRole),
    'timer.restricted': userHasPermission('timer.restricted', userRole),
    'timer.default': userHasPermission('timer.default', userRole),
    upvoting: userHasPermission('upvoting', userRole),
    'upvoting.anytime': userHasPermission('upvoting.anytime', userRole),
    'upvoting.limit': userHasPermission('upvoting.limit', userRole),
    'upvoting.restricted': userHasPermission('upvoting.restricted', userRole),
  } satisfies Record<PermissionKey, boolean>
}

function getDynamicBoardPermissions(
  userRole: BoardRole,
  settings: BoardSettings,
) {
  return {
    'music.restricted.canControl': hasMinimumDynamicPermissionRoles(
      +settings.musicRestricted,
      'music.restricted.canControl',
      userRole,
    ),
    'timer.restricted.canControl': hasMinimumDynamicPermissionRoles(
      +settings.timerRestricted,
      'timer.restricted.canControl',
      userRole,
    ),
    'upvoting.restricted.canUpvote': hasMinimumDynamicPermissionRoles(
      +settings.upvoteRestricted,
      'upvoting.restricted.canUpvote',
      userRole,
    ),
  } satisfies Record<DynamcicPermissionKey, boolean>
}

export function getUserLevels(userRole: BoardRole) {
  return {
    hasOwner: hasMinimumRole('OWNER', userRole),
    hasAdmin: hasMinimumRole('ADMIN', userRole),
    hasFacilitator: hasMinimumRole('FACILITATOR', userRole),
    hasMember: hasMinimumRole('MEMBER', userRole),
    hasViewer: hasMinimumRole('VIEWER', userRole),
  }
}

export function createInitialState(settings: BoardSettings) {
  return {
    settings: settings,
    sidebarOpen: false,
    boardSettingsWithPermissions: getSettingsWithPermissions(
      settings,
      'VIEWER',
    ),
    userPermissions: getUserBoardPermissions('VIEWER', settings),
    user: {
      hasOwner: false,
      hasAdmin: false,
      hasFacilitator: false,
      hasMember: false,
      hasViewer: false,
    },
  }
}
