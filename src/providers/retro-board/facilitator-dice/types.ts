import type {
  FacilitatorDiceInternalAction,
  FacilitatorDiceMessageType,
} from './enums'

export type DiceParticipant = {
  clientId: string
  name: string
  image: string
  result?: number
  color?: string
}

export type DiceSession = {
  sessionId: string
  initiatorClientId: string
  participants: Record<string, DiceParticipant>
}

export type FacilitatorDiceState = {
  activeSession: DiceSession | undefined
}

export type FacilitatorDiceAction =
  | {
      type: FacilitatorDiceMessageType.DICE_SESSION_START
      session: DiceSession
    }
  | {
      type: FacilitatorDiceMessageType.DICE_ROLL_RESULT
      clientId: string
      result: number
      color: string
    }
  | {
      type: FacilitatorDiceInternalAction.CLEAR_SESSION
    }
