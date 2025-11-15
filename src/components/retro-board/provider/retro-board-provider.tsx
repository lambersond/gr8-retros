'use client'

import {
  createContext,
  useReducer,
  useContext,
  type Dispatch,
  type ReactNode,
} from 'react'
import { MessageManager } from './message-manager'
import { reducer } from './reducer'
import * as utils from './utils'
import type { RetroBoardAction, RetroBoardState } from './types'
import type { Board } from '@/types'

const RetroBoardCtx = createContext<RetroBoardState | undefined>(undefined)
const RetroBoardDispatchCtx = createContext<
  Dispatch<RetroBoardAction> | undefined
>(undefined)

export function RetroBoardProvider({
  children,
  board,
}: Readonly<{
  children: ReactNode
  board: Board
}>) {
  const [state, dispatch] = useReducer(reducer, board, utils.createInitialState)

  return (
    <RetroBoardCtx.Provider value={state}>
      <RetroBoardDispatchCtx.Provider value={dispatch}>
        <MessageManager boardId={board.id}>{children}</MessageManager>
      </RetroBoardDispatchCtx.Provider>
    </RetroBoardCtx.Provider>
  )
}

export function useRetroBoard() {
  const ctx = useContext(RetroBoardCtx)
  if (!ctx) {
    throw new Error('useRetroBoard must be used within RetroBoardProvider')
  }
  return ctx
}

export function useRetroBoardDispatch() {
  const ctx = useContext(RetroBoardDispatchCtx)
  if (!ctx) {
    throw new Error(
      'useRetroBoardDispatch must be used within RetroBoardProvider',
    )
  }
  return ctx
}
