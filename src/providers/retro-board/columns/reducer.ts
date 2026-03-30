import { actionHandlers } from './action-handler'
import type {
  ActionHandler,
  BoardColumnsReducerAction,
  BoardColumnsState,
} from './types'

export function reducer(
  state: BoardColumnsState,
  action: BoardColumnsReducerAction,
) {
  const handler = actionHandlers[action.type] as ActionHandler<typeof action>
  if (handler) {
    return handler(state, action)
  } else {
    throw new Error(`Unhandled column-action type: ${(action as any).type}`)
  }
}
