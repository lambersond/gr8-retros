import { BoardSettingsInternalActionType } from '../enums'
import { useBoardSettingsDispatch } from '../provider'

export function useBoardSettingsDispatcher() {
  const dispatch = useBoardSettingsDispatch()

  function openSidebar() {
    dispatch({
      type: BoardSettingsInternalActionType.OPEN_SIDEBAR,
    })
  }

  function closeSidebar() {
    dispatch({ type: BoardSettingsInternalActionType.CLOSE_SIDEBAR })
  }

  return { openSidebar, closeSidebar, dispatch }
}
