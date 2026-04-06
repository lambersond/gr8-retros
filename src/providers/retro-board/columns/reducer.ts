import { actionHandlers } from './action-handler'
import type { BoardColumnsReducerAction, BoardColumnsState } from './types'

export function reducer(
  state: BoardColumnsState,
  action: BoardColumnsReducerAction,
) {
  const handler = actionHandlers[action.type]
  if (handler) {
    return handler(state, action)
  } else {
    throw new Error(`Unhandled column-action type: ${(action as any).type}`)
  }
}
