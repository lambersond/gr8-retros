import type { DiceParticipant, DiceSession } from './types'

/** A participant is resolved once they've rolled a value or been marked DNR. */
export function isParticipantResolved(participant: DiceParticipant): boolean {
  return participant.result !== undefined || !!participant.dnr
}

/** A participant has rolled once they have a numeric result (DNR/pending: false). */
export function hasParticipantRolled(participant: DiceParticipant): boolean {
  return participant.result !== undefined
}

/** Every prompted participant has rolled a value (nobody pending or DNR). */
export function allParticipantsRolled(session: DiceSession): boolean {
  const participants = Object.values(session.participants)
  return (
    participants.length > 0 &&
    participants.every(participant => hasParticipantRolled(participant))
  )
}

/** A roll session is complete when it has participants and all are resolved. */
export function isSessionComplete(session: DiceSession): boolean {
  const participants = Object.values(session.participants)
  return (
    participants.length > 0 &&
    participants.every(participant => isParticipantResolved(participant))
  )
}
