import { render, screen, waitFor } from '@test-utils'
import userEvent from '@testing-library/user-event'
import { FacilitatorModeSettings } from './facilitator-mode-settings'

const mockSaveSetting = jest.fn()
const mockUpdateBoardSetting = jest.fn(() => mockSaveSetting)
const mockUpdateBoardControls = jest.fn()
let mockControls = { isSessionActive: false, isGuidedActive: false }
let mockFacilitateSessionEnabled = true

jest.mock('@/providers/retro-board/board-settings', () => ({
  useBoardSettingsActions: () => ({
    updateBoardSetting: mockUpdateBoardSetting,
  }),
  useBoardSettings: () => ({
    settings: {
      facilitatorMode: {
        title: 'Facilitator Mode',
        icon: () => <svg />,
        canEdit: true,
        enabled: true,
        isUnlocked: true,
        key: 'isFacilitatorModeEnabled',
        subsettings: {
          facilitateSession: {
            title: 'Enable Facilitate Session',
            key: 'isFacilitateSessionEnabled',
            kind: 'toggle',
            canEdit: true,
            enabled: mockFacilitateSessionEnabled,
          },
        },
      },
    },
  }),
}))
jest.mock('@/providers/retro-board/controls', () => ({
  useBoardControlsState: () => mockControls,
  useBoardControlsActions: () => mockUpdateBoardControls,
}))

const toggleFacilitateSession = () =>
  userEvent.click(screen.getByLabelText('Enable Facilitate Session'))

describe('FacilitatorModeSettings', () => {
  beforeEach(() => {
    mockControls = { isSessionActive: false, isGuidedActive: false }
    mockFacilitateSessionEnabled = true
  })

  it('ends a running facilitated session when Facilitate Session is disabled', async () => {
    mockControls = { isSessionActive: true, isGuidedActive: false }
    render(<FacilitatorModeSettings />)

    await toggleFacilitateSession()

    expect(mockUpdateBoardSetting).toHaveBeenCalledWith(
      'isFacilitateSessionEnabled',
      false,
    )
    await waitFor(() =>
      expect(mockUpdateBoardControls).toHaveBeenCalledWith({
        facilitatorMode: { isActive: false, skippedIds: [] },
      }),
    )
  })

  it.each([
    {
      scenario: 'guided mode owns the session',
      controls: { isSessionActive: true, isGuidedActive: true },
      enabled: true,
    },
    {
      scenario: 'no session is running',
      controls: { isSessionActive: false, isGuidedActive: false },
      enabled: true,
    },
    {
      scenario: 'Facilitate Session is being enabled',
      controls: { isSessionActive: true, isGuidedActive: false },
      enabled: false,
    },
  ])(
    'leaves the session alone when $scenario',
    async ({ controls, enabled }) => {
      mockControls = controls
      mockFacilitateSessionEnabled = enabled
      render(<FacilitatorModeSettings />)

      await toggleFacilitateSession()

      await waitFor(() => expect(mockSaveSetting).toHaveBeenCalled())
      expect(mockUpdateBoardControls).not.toHaveBeenCalled()
    },
  )
})
