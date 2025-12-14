'use client'

import {
  createContext,
  useReducer,
  useContext,
  type Dispatch,
  type ReactNode,
} from 'react'
import { CardsManager } from './cards-manager'
import { reducer } from './reducer'
import * as utils from './utils'
import type { CardsState } from './types'
import type { Board } from '@/types'
import type { CardAction } from '@/types/retro-board'

const CardProviderCtx = createContext<CardsState | undefined>(undefined)
const CardProviderDispatchCtx = createContext<Dispatch<CardAction> | undefined>(
  undefined,
)

export function BoardCardsProvider({
  board,
  children,
}: Readonly<{
  board: Board
  children: ReactNode
}>) {
  const [state, dispatch] = useReducer(reducer, board, utils.createInitialState)

  return (
    <CardProviderCtx.Provider value={state}>
      <CardProviderDispatchCtx.Provider value={dispatch}>
        <CardsManager boardId={board.id}>{children}</CardsManager>
      </CardProviderDispatchCtx.Provider>
    </CardProviderCtx.Provider>
  )
}

export function useBoardCards() {
  const ctx = useContext(CardProviderCtx)
  if (!ctx) {
    throw new Error('useBoardCards must be used within CardsProvider')
  }
  return ctx
}

export function useBoardCardsDispatch() {
  const ctx = useContext(CardProviderDispatchCtx)
  if (!ctx) {
    throw new Error('useBoardCardsDispatch must be used within CardsProvider')
  }
  return ctx
}
