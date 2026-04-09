import type { SidebarActionType } from '@/types'

export type CommentsSidebarState = {
  sidebarOpen: boolean
  cardId?: string
  groupId?: string
  boardId: string
}

export type CommentsSidebarActionType = SidebarActionType

export type CommentsSidebarAction =
  | {
      type: CommentsSidebarActionType['OPEN_SIDEBAR']
      payload: {
        cardId?: string
        groupId?: string
        boardId: string
      }
    }
  | { type: CommentsSidebarActionType['CLOSE_SIDEBAR'] }
