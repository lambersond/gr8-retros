import { useCommentsSidebarDispatch } from '../comments-sidebar-provider'
import { COMMENTS_SIDEBAR_ACTION_TYPES } from '../constants'
import type { ColumnType } from '@/types'

export function useCommentsSidebarActions() {
  const dispatch = useCommentsSidebarDispatch()

  function openSidebar(cardId: string, boardId: string, column: ColumnType) {
    dispatch({
      type: COMMENTS_SIDEBAR_ACTION_TYPES.OPEN_SIDEBAR,
      payload: {
        cardId,
        boardId,
        column,
      },
    })
  }

  function closeSidebar() {
    dispatch({ type: COMMENTS_SIDEBAR_ACTION_TYPES.CLOSE_SIDEBAR })
  }

  return {
    openSidebar,
    closeSidebar,
  }
}
