import type { ColumnType } from '@/types'

export type CommentsSidebarState = {
  sidebarOpen: boolean
  cardId?: string
  column?: ColumnType
  boardId: string
}

export type CommentsSidebarActionType = {
  OPEN_SIDEBAR: 'OPEN_SIDEBAR'
  CLOSE_SIDEBAR: 'CLOSE_SIDEBAR'
}

export type CommentsSidebarAction =
  | {
      type: CommentsSidebarActionType['OPEN_SIDEBAR']
      payload: {
        cardId: string
        boardId: string
        column: ColumnType
      }
    }
  | { type: CommentsSidebarActionType['CLOSE_SIDEBAR'] }
