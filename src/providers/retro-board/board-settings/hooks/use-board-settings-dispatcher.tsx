import { BOARD_SETTINGS_ACTION_TYPES } from '../constants'
import { useBoardSettingsDispatch } from '../provider'

export function useBoardSettingsDispatcher() {
  const dispatch = useBoardSettingsDispatch()

  function openSidebar() {
    dispatch({
      type: BOARD_SETTINGS_ACTION_TYPES.OPEN_SIDEBAR,
    })
  }

  function closeSidebar() {
    dispatch({ type: BOARD_SETTINGS_ACTION_TYPES.CLOSE_SIDEBAR })
  }

  return { openSidebar, closeSidebar, dispatch }
}
