import { Checkbox } from '@/components/common'
import {
  SettingsToggle,
  SubsettingsContainer,
} from '@/components/settings-toggle'
import {
  useBoardSettings,
  useBoardSettingsActions,
} from '@/providers/retro-board/board-settings'
import {
  useBoardControlsActions,
  useBoardControlsState,
} from '@/providers/retro-board/controls'

export function FacilitatorModeSettings() {
  const { updateBoardSetting } = useBoardSettingsActions()
  const {
    settings: {
      facilitatorMode: {
        subsettings: { facilitateSession },
        ...setting
      },
    },
  } = useBoardSettings()
  const { isSessionActive, isGuidedActive } = useBoardControlsState(s => ({
    isSessionActive: s.boardControls.facilitatorMode.isActive,
    isGuidedActive: s.boardControls.guided.isActive,
  }))
  const updateBoardControls = useBoardControlsActions(
    a => a.updateBoardControls,
  )

  const toggleFacilitateSession = async () => {
    const enable = !facilitateSession.enabled
    await updateBoardSetting(facilitateSession.key, enable)()

    // Disabling hides the Facilitate Session button, which is also how a
    // session is ended, so end a running one rather than strand it. Guided
    // mode drives its own Discuss phase and is left alone.
    if (!enable && isSessionActive && !isGuidedActive) {
      updateBoardControls({
        facilitatorMode: { isActive: false, skippedIds: [] },
      })
    }
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
        <Checkbox
          checked={facilitateSession.enabled}
          label={facilitateSession.title}
          size='sm'
          disabled={!setting.enabled || !facilitateSession.canEdit}
          onChange={toggleFacilitateSession}
        />
      </SubsettingsContainer>
    </SettingsToggle>
  )
}
