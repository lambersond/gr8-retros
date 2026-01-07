import type { BoardSettings } from '@/types'

type BaseSubsetting = {
  title: string
  key: keyof BoardSettings | undefined
  hint?: string
  canEdit?: boolean
}

type ToggleSubsetting = BaseSubsetting & {
  kind: 'toggle'
  enabled: boolean
}

type ValueSubsetting = BaseSubsetting & {
  kind: 'value'
  value: number
}

type ButtonSubsetting = BaseSubsetting & {
  kind: 'button'
  enabled: boolean
}

interface Setting {
  canEdit?: boolean
  enabled: boolean
  hint?: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  isUnlocked?: boolean
  key: keyof BoardSettings
  render: boolean
  title: string
}

interface PrivateSetting extends Setting {
  subsettings: {
    openAccess: ToggleSubsetting
    createLink: ButtonSubsetting
    copyLink: ButtonSubsetting
    revokeLink: ButtonSubsetting
    manageUsers: ButtonSubsetting
  }
}

interface CommentSetting extends Setting {
  subsettings: {
    anytime: ToggleSubsetting
  }
}

interface MusicSetting extends Setting {
  subsettings: {
    anytime: ToggleSubsetting
  }
}

interface TimerSetting extends Setting {
  subsettings: {
    anytime: ToggleSubsetting
  }
}

interface UpvotingSetting extends Setting {
  subsettings: {
    anytime: ToggleSubsetting
    limit: ValueSubsetting
  }
}

export type BoardSettingsWithPermissions = {
  private: PrivateSetting
  comments: CommentSetting
  music: MusicSetting
  timer: TimerSetting
  upvoting: UpvotingSetting
}

export type BoardSettingsWithPermissionsNoIcons = Omit<
  BoardSettingsWithPermissions,
  'private' | 'comments' | 'music' | 'timer' | 'upvoting'
> & {
  private: Omit<PrivateSetting, 'icon'>
  comments: Omit<CommentSetting, 'icon'>
  music: Omit<MusicSetting, 'icon'>
  timer: Omit<TimerSetting, 'icon'>
  upvoting: Omit<UpvotingSetting, 'icon'>
}
