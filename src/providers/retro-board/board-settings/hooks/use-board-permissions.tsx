import { useBoardSettingsState } from '../provider'

export function useBoardPermissions() {
  const ctx = useBoardSettingsState()
  return {
    canClaimBoard: !ctx.settings.isPrivate && !ctx.settings.ownerId,
    user: ctx.user,
    userPermissions: ctx.userPermissions,
  }
}
