import clsx from 'classnames'
import type { RetroBoardActionType } from './types'

export const ACTION_TYPES: RetroBoardActionType = {
  SET_FROM_BOARD: 'SET_FROM_BOARD',
  ADD_CARD: 'ADD_CARD',
  UPDATE_CARD: 'UPDATE_CARD',
  DELETE_CARD: 'DELETE_CARD',
  DELETE_ALL_CARDS: 'DELETE_ALL_CARDS',
  DELETE_COMPLETED_CARDS: 'DELETE_COMPLETED_CARDS',
  TOGGLE_UPVOTE: 'TOGGLE_UPVOTE',
  MARK_DISCUSSED: 'MARK_DISCUSSED',
  ADD_ACTION_ITEM: 'ADD_ACTION_ITEM',
  TOGGLE_DONE_ACTION_ITEM: 'TOGGLE_DONE_ACTION_ITEM',
  UPDATE_ACTION_ITEM: 'UPDATE_ACTION_ITEM',
  ADD_CARD_COMMENT: 'ADD_CARD_COMMENT',
  UPDATE_CARD_COMMENT: 'UPDATE_CARD_COMMENT',
  DELETE_CARD_COMMENT: 'DELETE_CARD_COMMENT',
}

export const COLUMN_CONTAINER_CLASSES = clsx(
  'flex-1 min-h-0 overflow-hidden',
  'flex gap-3 sm:gap-0 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth py-3 [-webkit-overflow-scrolling:touch]',
  'lg:grid lg:grid-cols-4 lg:gap-3 lg:p-3 lg:overflow-hidden lg:px-3',
)

export const COLUMN_CLASSES = clsx(
  'snap-start w-full px-3 shrink-0 min-h-0',
  'sm:w-1/2 sm:px-2',
  'lg:snap-none lg:w-auto lg:px-0 lg:shrink lg:min-h-full',
)
