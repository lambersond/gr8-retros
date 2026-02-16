import { Checkbox, Input } from '@/components/common'
import {
  SettingsToggle,
  SubsettingsContainer,
} from '@/components/settings-toggle'
import {
  useBoardPermissions,
  useBoardSettings,
  useBoardSettingsActions,
} from '@/providers/retro-board/board-settings'

export function UpvoteSettings() {
  const { updateBoardSetting } = useBoardSettingsActions()
  const {
    settings: {
      upvoting: { subsettings, ...setting },
    },
  } = useBoardSettings()
  const { userPermissions } = useBoardPermissions()

  const handleLimitChange = (e: React.FocusEvent<HTMLInputElement>) => {
    updateBoardSetting(subsettings.limit.key, Number(e.target.value))
  }

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
            disabled={!setting.enabled}
            onChange={updateBoardSetting(
              subsettings.anytime.key,
              !subsettings.anytime.enabled,
            )}
          />
          <Input
            type='number'
            label={subsettings.limit.title}
            defaultValue={subsettings.limit.value}
            containerClassName='max-w-28'
            className='w-12'
            min={-1}
            onBlur={handleLimitChange}
            hint={subsettings.limit.hint}
            disabled={!setting.enabled}
          />
        </div>
        <Checkbox
          checked={subsettings.restricted.enabled}
          label={subsettings.restricted.title}
          size='sm'
          disabled={!setting.enabled || !userPermissions['upvoting.restricted']}
          onChange={updateBoardSetting(
            subsettings.restricted.key,
            !subsettings.restricted.enabled,
          )}
        />
      </SubsettingsContainer>
    </SettingsToggle>
  )
}
