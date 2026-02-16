import { useCommentsSidebarDispatch } from '../comments-sidebar-provider'
import { COMMENTS_SIDEBAR_ACTION_TYPES } from '../constants'

export function useCommentsSidebarActions() {
  const dispatch = useCommentsSidebarDispatch()

  function openSidebar(cardId: string, boardId: string) {
    dispatch({
      type: COMMENTS_SIDEBAR_ACTION_TYPES.OPEN_SIDEBAR,
      payload: {
        cardId,
        boardId,
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
