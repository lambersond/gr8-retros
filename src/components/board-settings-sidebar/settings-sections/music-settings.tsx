import { Checkbox } from '@/components/common'
import {
  SettingsToggle,
  SubsettingsContainer,
} from '@/components/settings-toggle'
import {
  useBoardSettings,
  useBoardSettingsActions,
} from '@/providers/retro-board/board-settings'

export function MusicSettings() {
  const { updateBoardSetting } = useBoardSettingsActions()
  const {
    settings: {
      music: { subsettings, ...setting },
    },
  } = useBoardSettings()

  return (
    <SettingsToggle
      title={setting.title}
      Icon={setting.icon}
      canEdit={setting.canEdit}
      isEnabled={setting.enabled}
      isUnlocked={setting.isUnlocked}
      onToggle={updateBoardSetting(setting.key, !setting.enabled)}
    >
      <SubsettingsContainer show={setting.enabled}>
        <Checkbox
          defaultChecked={subsettings.anytime.enabled}
          label={subsettings.anytime.title}
          size='sm'
          disabled={!setting.enabled}
          onChange={updateBoardSetting(
            subsettings.anytime.key!,
            !subsettings.anytime.enabled,
          )}
        />
      </SubsettingsContainer>
    </SettingsToggle>
  )
}
