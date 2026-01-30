'use client'

import {
  createContext,
  useReducer,
  useContext,
  type Dispatch,
  type ReactNode,
} from 'react'
import { DEFAULT_STATE } from './constants'
import { reducer } from './reducer'
import * as utils from './utils'
import type { BoardCardsReducerAction, BoardCardsState } from './types'
import type { Board } from '@/types'

const CardsProviderCtx = createContext<BoardCardsState>(DEFAULT_STATE)
const CardsProviderDispatchCtx = createContext<
  Dispatch<BoardCardsReducerAction> | undefined
>(undefined)

export function BoardCardsProvider({
  board,
  children,
}: Readonly<{
  board: Board
  children: ReactNode
}>) {
  const [state, dispatch] = useReducer(reducer, board, utils.createInitialState)

  return (
    <CardsProviderCtx.Provider value={state}>
      <CardsProviderDispatchCtx.Provider value={dispatch}>
        {children}
      </CardsProviderDispatchCtx.Provider>
    </CardsProviderCtx.Provider>
  )
}

export function useBoardCards() {
  const ctx = useContext(CardsProviderCtx)
  if (!ctx) {
    throw new Error('useBoardCards must be used within CardsProvider')
  }
  return ctx
}

export function useBoardCardsDispatch() {
  const ctx = useContext(CardsProviderDispatchCtx)
  if (!ctx) {
    throw new Error('useBoardCardsDispatch must be used within CardsProvider')
  }
  return ctx
}
