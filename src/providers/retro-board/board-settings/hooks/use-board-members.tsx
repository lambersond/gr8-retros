import { useBoardSettingsState } from '../provider'

export function useBoardMembers() {
  const ctx = useBoardSettingsState()
  return ctx.settings.members
}
