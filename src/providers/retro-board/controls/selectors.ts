import { useContext } from 'react'
import {
  RetroBoardControlsActionsStoreContext,
  RetroBoardControlsStateStoreContext,
} from './context'
import { useStoreSelector } from './store'
import type {
  RetroBoardControlsActions,
  RetroBoardControlsState,
} from './types'

export function useBoardControlsState<S>(
  selector: (state: RetroBoardControlsState) => S,
  isEqual?: (a: S, b: S) => boolean,
): S {
  const store = useContext(RetroBoardControlsStateStoreContext)
  return useStoreSelector(store, selector, isEqual)
}

export function useBoardControlsActions<S>(
  selector: (actions: RetroBoardControlsActions) => S,
  isEqual?: (a: S, b: S) => boolean,
): S {
  const store = useContext(RetroBoardControlsActionsStoreContext)
  return useStoreSelector(store, selector, isEqual)
}
