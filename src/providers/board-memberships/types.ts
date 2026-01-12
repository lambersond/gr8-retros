import type { BoardRole } from '@/enums'

export type BoardMembershipData = {
  boardId: string
  settingsId: string
  role: BoardRole
  permissionMask?: number
}

export type BoardMembershipContextType = {
  boards: BoardMembershipData[]
  getRole: (boardId: string) => BoardRole | undefined
  getSettingsId: (boardId: string) => string | undefined
  hasRole: (boardId: string, minimumRole: BoardRole) => boolean
  isLoading: boolean
  fetchBoards: (force?: boolean) => Promise<void>
  ensureBoardInCache: (boardId: string) => Promise<BoardRole | undefined> // Updated
  clearCache: VoidFunction
}
