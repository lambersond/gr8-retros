import { BoardColumnsMessageType } from './enums'
import type { ActionHandler, BoardColumnsReducerAction } from './types'

export const actionHandlers: {
  [K in BoardColumnsMessageType]: ActionHandler<
    Extract<BoardColumnsReducerAction, { type: K }>
  >
} = {
  [BoardColumnsMessageType.UPDATE_COLUMNS]: (_, action) => {
    return {
      columns: action.columns,
    }
  },
}
