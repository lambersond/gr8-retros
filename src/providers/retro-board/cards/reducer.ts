import { boardCardActionHandlers } from './action-handler'
import type {
  ActionHandler,
  BoardCardsReducerAction,
  BoardCardsState,
} from './types'

export function reducer(
  state: BoardCardsState,
  action: BoardCardsReducerAction,
) {
  const handler = boardCardActionHandlers[action.type] as ActionHandler<
    typeof action
  >
  if (handler) {
    return handler(state, action)
  } else {
    throw new Error(`Unhandled card-action type: ${(action as any).type}`)
  }
}
