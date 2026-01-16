import { Checkbox } from '@/components/common'
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
        <div className='hidden'>
          <Checkbox
            defaultChecked={subsettings.anytime.enabled}
            label={subsettings.anytime.title}
            size='sm'
            disabled={!setting.enabled || !userPermissions['timer.anytime']}
            onChange={updateBoardSetting(
              subsettings.anytime.key!,
              !subsettings.anytime.enabled,
            )}
          />
        </div>
        <Checkbox
          checked={subsettings.restricted.enabled}
          label={subsettings.restricted.title}
          size='sm'
          disabled={!setting.enabled || !userPermissions['music.restricted']}
          onChange={updateBoardSetting(
            subsettings.restricted.key!,
            !subsettings.restricted.enabled,
          )}
        />
      </SubsettingsContainer>
    </SettingsToggle>
  )
}
