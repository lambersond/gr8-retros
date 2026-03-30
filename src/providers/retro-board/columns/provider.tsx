'use client'

import {
  createContext,
  type Dispatch,
  useContext,
  useReducer,
  type ReactNode,
} from 'react'
import { reducer } from './reducer'
import { createInitialState } from './utils'
import type { BoardColumnsReducerAction, BoardColumnsState } from './types'
import type { Board } from '@/types'

const BoardColumnsProviderCtx = createContext<BoardColumnsState>({
  columns: [],
})
const BoardColumnsProviderDispatchCtx = createContext<
  Dispatch<BoardColumnsReducerAction> | undefined
>(undefined)

export function BoardColumnsProvider({
  board,
  children,
}: Readonly<{
  board: Board
  children: ReactNode
}>) {
  const [state, dispatch] = useReducer(reducer, board, createInitialState)

  return (
    <BoardColumnsProviderCtx.Provider value={state}>
      <BoardColumnsProviderDispatchCtx.Provider value={dispatch}>
        {children}
      </BoardColumnsProviderDispatchCtx.Provider>
    </BoardColumnsProviderCtx.Provider>
  )
}

export function useBoardColumns() {
  const ctx = useContext(BoardColumnsProviderCtx)
  if (!ctx)
    throw new Error('useBoardColumns must be used inside BoardColumnsProvider')
  return ctx
}

export function useBoardColumnsDispatch() {
  const ctx = useContext(BoardColumnsProviderDispatchCtx)
  if (!ctx) {
    throw new Error(
      'useBoardColumnsDispatch must be used within BoardColumnsProvider',
    )
  }
  return ctx
}
