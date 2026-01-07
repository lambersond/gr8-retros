'use client'

import {
  createContext,
  useReducer,
  useContext,
  type Dispatch,
  type ReactNode,
  useEffect,
} from 'react'
import { BoardSettingsMessageManager } from './board-settings-message-manager'
import { BOARD_SETTINGS_ACTION_TYPES } from './constants'
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
  boardId,
  children,
  settings,
}: Readonly<{
  boardId: string
  children: ReactNode
  settings: BoardSettings
}>) {
  const { user } = useAuth()
  const [state, dispatch] = useReducer(reducer, settings, createInitialState)

  useEffect(() => {
    dispatch({
      type: BOARD_SETTINGS_ACTION_TYPES.UPDATE_PERMISSIONS,
      payload: {
        userRole: user.boards?.[state.settings.retroSessionId]?.role,
      },
    })
  }, [state.settings, user.boards])

  return (
    <BoardSettingsCtx.Provider value={state}>
      <BoardSettingsDispatchCtx.Provider value={dispatch}>
        <BoardSettingsMessageManager boardId={boardId}>
          {children}
        </BoardSettingsMessageManager>
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
