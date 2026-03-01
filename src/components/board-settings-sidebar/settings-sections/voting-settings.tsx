import { Checkbox } from '@/components/common'
import { NumberInput } from '@/components/number-input'
import {
  SettingsToggle,
  SubsettingsContainer,
} from '@/components/settings-toggle'
import { VotingMode } from '@/enums'
import {
  useBoardPermissions,
  useBoardSettings,
  useBoardSettingsActions,
} from '@/providers/retro-board/board-settings'

export function VotingSettings() {
  const { updateBoardSetting } = useBoardSettingsActions()
  const {
    settings: {
      voting: { subsettings, ...setting },
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
          disabled={!setting.enabled || !userPermissions['voting.restricted']}
          onChange={updateBoardSetting(
            subsettings.restricted.key,
            !subsettings.restricted.enabled,
          )}
        />
        <NumberInput
          defaultValue={subsettings.limit.value}
          label={subsettings.limit.hint!}
          title={subsettings.limit.title}
          onChange={value => updateBoardSetting(subsettings.limit.key, value)()}
          disabled={!setting.enabled || !userPermissions['voting.limit']}
          min={1}
          max={100}
        />
        <Checkbox
          checked={subsettings.votingMode.choice === VotingMode.MULTI}
          label={subsettings.votingMode.title}
          size='sm'
          info={subsettings.votingMode.hint}
          disabled={!setting.enabled || !userPermissions['voting.mode']}
          onChange={() =>
            updateBoardSetting(
              subsettings.votingMode.key,
              subsettings.votingMode.choice === VotingMode.MULTI
                ? VotingMode.SINGLE
                : VotingMode.MULTI,
            )()
          }
        />
      </SubsettingsContainer>
    </SettingsToggle>
  )
}
