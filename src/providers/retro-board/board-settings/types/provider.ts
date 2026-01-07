import type { BoardSettingsWithPermissions } from './settings'
import type { PermissionKey } from '@/lib/roles'
import type { BoardSettings } from '@/types'

export type BoardSettingsState = {
  sidebarOpen: boolean
  settings: BoardSettings
  boardSettingsWithPermissions: BoardSettingsWithPermissions
  user: {
    hasOwner: boolean
    hasAdmin: boolean
    hasFacilitator: boolean
    hasMember: boolean
    hasViewer: boolean
  }
  userPermissions: Record<PermissionKey, boolean>
}
