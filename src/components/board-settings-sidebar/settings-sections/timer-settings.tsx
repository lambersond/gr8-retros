import { Checkbox } from '@/components/common'
import { NumberInput } from '@/components/number-input'
import {
  SettingsToggle,
  SubsettingsContainer,
} from '@/components/settings-toggle'
import {
  useBoardPermissions,
  useBoardSettings,
  useBoardSettingsActions,
} from '@/providers/retro-board/board-settings'

export function TimerSettings() {
  const { updateBoardSetting } = useBoardSettingsActions()
  const {
    settings: {
      timer: { subsettings, ...setting },
    },
  } = useBoardSettings()
  const { userPermissions } = useBoardPermissions()

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
          checked={subsettings.restricted.enabled}
          label={subsettings.restricted.title}
          size='sm'
          disabled={!setting.enabled || !userPermissions['timer.restricted']}
          onChange={updateBoardSetting(
            subsettings.restricted.key,
            !subsettings.restricted.enabled,
          )}
        />
        <NumberInput
          defaultValue={subsettings.defaultDuration.value}
          label='Seconds'
          title={subsettings.defaultDuration.title}
          showRangeHint={userPermissions['timer.default']}
          onChange={value =>
            updateBoardSetting(subsettings.defaultDuration.key, value)()
          }
          disabled={!setting.enabled || !userPermissions['timer.default']}
          min={1}
          max={3600}
        />
      </SubsettingsContainer>
    </SettingsToggle>
  )
}
