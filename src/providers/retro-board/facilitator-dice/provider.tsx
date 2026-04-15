'use client'

import { createContext, useContext, useReducer, type Dispatch } from 'react'
import { DiceGameLog } from './dice-game-log'
import { INITIAL_STATE, facilitatorDiceReducer } from './reducer'
import type { FacilitatorDiceAction, FacilitatorDiceState } from './types'

const StateContext = createContext<FacilitatorDiceState>(INITIAL_STATE)
const DispatchContext = createContext<
  Dispatch<FacilitatorDiceAction> | undefined
>(undefined)

export function FacilitatorDiceProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [state, dispatch] = useReducer(facilitatorDiceReducer, INITIAL_STATE)

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
        <DiceGameLog />
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export function useFacilitatorDiceState() {
  return useContext(StateContext)
}

export function useFacilitatorDiceDispatch() {
  const dispatch = useContext(DispatchContext)
  if (!dispatch) {
    throw new Error(
      'useFacilitatorDiceDispatch must be used within FacilitatorDiceProvider',
    )
  }
  return dispatch
}
