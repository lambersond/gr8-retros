import { BoardColumnsMessageType } from '../enums'
import type { BoardColumnsState } from './provider'
import type { Column } from '@/types'

export type ActionHandler<
  A extends BoardColumnsReducerAction = BoardColumnsReducerAction,
> = (state: BoardColumnsState, action: A) => BoardColumnsState

export type BoardColumnsReducerAction = {
  type: BoardColumnsMessageType.UPDATE_COLUMNS
  columns: Column[]
}
