import * as React from 'react'
import { createThrowingStore, type Store } from './store'
import type {
  RetroBoardControlsActions,
  RetroBoardControlsState,
} from './types'

export const RetroBoardControlsStateStoreContext = React.createContext<
  Store<RetroBoardControlsState>
>(createThrowingStore<RetroBoardControlsState>('useRetroBoardControlsState'))

export const RetroBoardControlsActionsStoreContext = React.createContext<
  Store<RetroBoardControlsActions>
>(
  createThrowingStore<RetroBoardControlsActions>(
    'useRetroBoardControlsActions',
  ),
)
