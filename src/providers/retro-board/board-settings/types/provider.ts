import type { BoardSettingsWithPermissions } from './settings'
import type { BoardRole } from '@/enums'
import type { BoardPermissions } from '@/lib/roles'
import type { BoardSettings } from '@/types'

export type BoardSettingsState = {
  boardName: string
  sidebarOpen: boolean
  settings: BoardSettings
  boardSettingsWithPermissions: BoardSettingsWithPermissions
  userRole: BoardRole
  user: {
    hasOwner: boolean
    hasAdmin: boolean
    hasFacilitator: boolean
    hasMember: boolean
    hasViewer: boolean
  }
  userPermissions: BoardPermissions
}
