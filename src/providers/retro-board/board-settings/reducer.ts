import { boardCardActionHandlers } from './action-hander'
import type { BoardSettingsReducerAction, BoardSettingsState } from './types'

export function reducer(
  state: BoardSettingsState,
  action: BoardSettingsReducerAction,
): BoardSettingsState {
  const handler = boardCardActionHandlers[action.type]
  return handler ? handler(state, action as never) : state
}
