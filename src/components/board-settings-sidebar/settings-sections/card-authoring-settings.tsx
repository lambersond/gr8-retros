import { SettingsToggle } from '@/components/settings-toggle'
import {
  useBoardSettings,
  useBoardSettingsActions,
} from '@/providers/retro-board/board-settings'

export function CardAuthoringSettings() {
  const { updateBoardSetting } = useBoardSettingsActions()
  const {
    settings: { cardAuthoring: setting },
  } = useBoardSettings()

  return (
    <SettingsToggle
      title={setting.title}
      Icon={setting.icon}
      canEdit={setting.canEdit}
      isEnabled={setting.enabled}
      isUnlocked={setting.isUnlocked}
      onToggle={updateBoardSetting(setting.key, !setting.enabled)}
    />
  )
}
