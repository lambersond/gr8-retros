import { withImpliedSettings } from './utils'

describe('server/board-settings/utils', () => {
  describe('withImpliedSettings', () => {
    it.each([
      {
        scenario: 'turning Facilitator Mode on also enables Facilitate Session',
        patch: { isFacilitatorModeEnabled: true },
        expected: {
          isFacilitatorModeEnabled: true,
          isFacilitateSessionEnabled: true,
        },
      },
      {
        scenario:
          'turning Facilitator Mode off leaves Facilitate Session as is',
        patch: { isFacilitatorModeEnabled: false },
        expected: { isFacilitatorModeEnabled: false },
      },
      {
        scenario: 'toggling only Facilitate Session is passed through',
        patch: { isFacilitateSessionEnabled: false },
        expected: { isFacilitateSessionEnabled: false },
      },
    ])('$scenario', ({ patch, expected }) => {
      expect(withImpliedSettings(patch)).toEqual(expected)
    })
  })
})
