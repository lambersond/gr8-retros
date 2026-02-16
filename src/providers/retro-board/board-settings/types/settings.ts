import type { BoardSettings } from '@/types'

type BaseSubsetting = {
  title: string
  key: keyof BoardSettings
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

type ChoiceSubsetting = BaseSubsetting & {
  kind: 'choice'
  choices: string[]
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
    cardRetention: ValueSubsetting
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
    restricted: ToggleSubsetting
  }
}

interface TimerSetting extends Setting {
  subsettings: {
    anytime: ToggleSubsetting
    restricted: ToggleSubsetting
    defaultDuration: ValueSubsetting
  }
}

interface UpvotingSetting extends Setting {
  subsettings: {
    anytime: ToggleSubsetting
    limit: ValueSubsetting
    restricted: ToggleSubsetting
  }
}

interface VotingSetting extends Setting {
  subsettings: {
    votingMode: ChoiceSubsetting
    limit: ValueSubsetting
    restricted: ToggleSubsetting
  }
}

export type BoardSettingsWithPermissions = {
  private: PrivateSetting
  comments: CommentSetting
  music: MusicSetting
  timer: TimerSetting
  upvoting: UpvotingSetting
  voting: VotingSetting
}

export type BoardSettingsWithPermissionsNoIcons = Omit<
  BoardSettingsWithPermissions,
  'private' | 'comments' | 'music' | 'timer' | 'upvoting' | 'voting'
> & {
  private: Omit<PrivateSetting, 'icon'>
  comments: Omit<CommentSetting, 'icon'>
  music: Omit<MusicSetting, 'icon'>
  timer: Omit<TimerSetting, 'icon'>
  upvoting: Omit<UpvotingSetting, 'icon'>
  voting: Omit<VotingSetting, 'icon'>
}
