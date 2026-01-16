import { useBoardSettingsState } from '../provider'

export function useBoardSettings() {
  const ctx = useBoardSettingsState()
  return {
    boardId: ctx.settings.retroSessionId,
    canClaimBoard: !ctx.settings.isPrivate && !ctx.settings.ownerId,
    isClaimed: !!ctx.settings.ownerId,
    id: ctx.settings.id,
    ownerId: ctx.settings.ownerId,
    boardTier: ctx.settings.boardTier,
    settings: ctx.boardSettingsWithPermissions,
    invite: ctx.settings.invite,
    sidebarOpen: ctx.sidebarOpen,
    members: ctx.settings.members,
    user: ctx.user,
    userPermissions: ctx.userPermissions,
  }
}
