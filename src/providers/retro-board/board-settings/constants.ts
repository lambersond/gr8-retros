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
        kind: 'toggle',
        title: 'Allow Open Access',
        enabled: false,
        key: 'privateOpenAccess',
        canEdit: false,
      },
      createLink: {
        kind: 'button',
        title: 'Create An Invitation Link',
        enabled: false,
        key: undefined,
        canEdit: false,
      },
      copyLink: {
        kind: 'button',
        title: 'Copy Link',
        enabled: false,
        key: undefined,
        canEdit: false,
      },
      revokeLink: {
        kind: 'button',
        title: 'Revoke',
        enabled: false,
        key: undefined,
        canEdit: false,
      },
      manageUsers: {
        kind: 'button',
        title: 'Manage Board Users',
        enabled: false,
        key: undefined,
        canEdit: false,
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
        kind: 'toggle',
        title: 'Allow Comments Anytime',
        enabled: false,
        key: 'commentsAnytime',
        canEdit: false,
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
        kind: 'toggle',
        title: 'Allow Music Anytime',
        enabled: false,
        key: 'musicAnytime',
        canEdit: false,
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
        kind: 'toggle',
        title: 'Allow Timer Anytime',
        canEdit: false,
        enabled: false,
        key: 'timerAnytime',
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
        kind: 'toggle',
        title: 'Allow Upvoting Anytime',
        enabled: false,
        key: 'upvoteAnytime',
        canEdit: false,
      },
      limit: {
        kind: 'value',
        title: 'Upvote Limit',
        key: 'upvoteLimit',
        value: -1,
        canEdit: false,
        hint: '-1 for unlimited',
      },
    },
  },
}
