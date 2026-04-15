import {
  FacilitatorDiceInternalAction,
  FacilitatorDiceMessageType,
} from './enums'
import type { FacilitatorDiceAction, FacilitatorDiceState } from './types'

export const INITIAL_STATE: FacilitatorDiceState = {
  activeSession: undefined,
}

export function facilitatorDiceReducer(
  state: FacilitatorDiceState,
  action: FacilitatorDiceAction,
): FacilitatorDiceState {
  switch (action.type) {
    case FacilitatorDiceMessageType.DICE_SESSION_START: {
      return { activeSession: action.session }
    }
    case FacilitatorDiceMessageType.DICE_ROLL_RESULT: {
      if (!state.activeSession) return state
      const participant = state.activeSession.participants[action.clientId]
      if (!participant) return state
      return {
        activeSession: {
          ...state.activeSession,
          participants: {
            ...state.activeSession.participants,
            [action.clientId]: {
              ...participant,
              result: action.result,
              color: action.color,
            },
          },
        },
      }
    }
    case FacilitatorDiceInternalAction.CLEAR_SESSION: {
      return { activeSession: undefined }
    }
    default: {
      return state
    }
  }
}
