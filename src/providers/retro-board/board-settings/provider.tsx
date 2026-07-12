'use client'

import {
  createContext,
  useReducer,
  useContext,
  type Dispatch,
  type ReactNode,
  useEffect,
} from 'react'
import { BoardSettingsInternalActionType } from './enums'
import { reducer } from './reducer'
import { createInitialState } from './utils'
import { useAuth } from '@/hooks/use-auth'
import type { BoardSettingsReducerAction, BoardSettingsState } from './types'
import type { BoardSettings } from '@/types'

const BoardSettingsCtx = createContext<BoardSettingsState | undefined>(
  undefined,
)
const BoardSettingsDispatchCtx = createContext<
  Dispatch<BoardSettingsReducerAction> | undefined
>(undefined)

export function BoardSettingsProvider({
  boardName,
  children,
  settings,
}: Readonly<{
  boardName: string
  children: ReactNode
  settings: BoardSettings
}>) {
  const { user } = useAuth()
  const [state, dispatch] = useReducer(
    reducer,
    { boardName, settings },
    createInitialState,
  )

  // The role comes from the board's own member list: it is server-rendered with
  // the board on every load and kept live by the NEW_MEMBER_ADDED /
  // UPDATE_MEMBER_ROLE / MEMBER_REMOVED / TRANSFER_BOARD reducers. Reading it
  // from the memberships cache instead left a just-admitted member on the
  // VIEWER fallback (that cache has a TTL and its provider never remounts), so
  // they silently could not vote until a manager toggled their role.
  useEffect(() => {
    const userRole = state.settings.members.find(
      member => member.user.id === user?.id,
    )?.role
    dispatch({
      type: BoardSettingsInternalActionType.UPDATE_PERMISSIONS,
      payload: {
        userRole,
      },
    })
  }, [state.settings, user?.id])

  return (
    <BoardSettingsCtx.Provider value={state}>
      <BoardSettingsDispatchCtx.Provider value={dispatch}>
        {children}
      </BoardSettingsDispatchCtx.Provider>
    </BoardSettingsCtx.Provider>
  )
}

export function useBoardSettingsState() {
  const ctx = useContext(BoardSettingsCtx)
  if (!ctx) {
    throw new Error(
      'useBoardSettings must be used within BoardSettingsProvider',
    )
  }
  return ctx
}

export function useBoardSettingsDispatch() {
  const ctx = useContext(BoardSettingsDispatchCtx)
  if (!ctx) {
    throw new Error(
      'useBoardSettingsDispatch must be used within BoardSettingsProvider',
    )
  }
  return ctx
}
