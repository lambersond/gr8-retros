import { SIDEBAR_ACTION_TYPES } from '@/constants'
import type {
  BoardSettingsReducerActionType,
  BoardSettingsWithPermissionsNoIcons,
} from './types'

export const BOARD_SETTINGS_ACTION_TYPES: BoardSettingsReducerActionType = {
  ...SIDEBAR_ACTION_TYPES,
  UPDATE_BOARD_SETTINGS: 'UPDATE_BOARD_SETTINGS',
  UPDATE_PERMISSIONS: 'UPDATE_PERMISSIONS',
  CREATE_INVITATION_LINK: 'CREATE_INVITATION_LINK',
  REVOKE_INVITATION_LINK: 'REVOKE_INVITATION_LINK',
  NEW_MEMBER_ADDED: 'NEW_MEMBER_ADDED',
  MEMBER_REMOVED: 'MEMBER_REMOVED',
  UPDATE_MEMBER_ROLE: 'UPDATE_MEMBER_ROLE',
}

export const BASE_SETTINGS: BoardSettingsWithPermissionsNoIcons = {
  private: {
    render: false,
    canEdit: false,
    enabled: false,
    hint: 'Only board owners can change privacy settings',
    isUnlocked: true,
    key: 'isPrivate',
    title: 'Private Board',
    subsettings: {
      openAccess: {
        canEdit: false,
        enabled: false,
        key: 'privateOpenAccess',
        kind: 'toggle',
        title: 'Enable Guest Access',
      },
    },
  },
  comments: {
    render: false,
    canEdit: false,
    enabled: false,
    isUnlocked: true,
    key: 'isCommentsEnabled',
    title: 'Comments Enabled',
    subsettings: {
      anytime: {
        canEdit: false,
        enabled: false,
        key: 'commentsAnytime',
        kind: 'toggle',
        title: 'Allow Comments Anytime',
      },
    },
  },
  music: {
    render: true,
    canEdit: false,
    enabled: false,
    isUnlocked: true,
    key: 'isMusicEnabled',
    title: 'Music Enabled',
    subsettings: {
      anytime: {
        canEdit: false,
        enabled: false,
        key: 'musicAnytime',
        kind: 'toggle',
        title: 'Allow Music Anytime',
      },
    },
  },
  timer: {
    render: true,
    canEdit: false,
    enabled: false,
    isUnlocked: true,
    key: 'isTimerEnabled',
    title: 'Timer Enabled',
    subsettings: {
      anytime: {
        canEdit: false,
        enabled: false,
        key: 'timerAnytime',
        kind: 'toggle',
        title: 'Allow Timer Anytime',
      },
    },
  },
  upvoting: {
    render: true,
    canEdit: false,
    enabled: false,
    isUnlocked: true,
    key: 'isUpvotingEnabled',
    title: 'Upvoting Enabled',
    subsettings: {
      anytime: {
        canEdit: false,
        enabled: false,
        key: 'upvoteAnytime',
        kind: 'toggle',
        title: 'Allow Upvoting Anytime',
      },
      limit: {
        canEdit: false,
        hint: '-1 for unlimited',
        key: 'upvoteLimit',
        kind: 'value',
        title: 'Upvote Limit',
        value: -1,
      },
    },
  },
}
