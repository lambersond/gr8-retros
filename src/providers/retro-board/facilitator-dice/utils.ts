import type { DiceParticipant, DiceSession } from './types'

/** A participant is resolved once they've rolled a value or been marked DNR. */
export function isParticipantResolved(participant: DiceParticipant): boolean {
  return participant.result !== undefined || !!participant.dnr
}

/** A roll session is complete when it has participants and all are resolved. */
export function isSessionComplete(session: DiceSession): boolean {
  const participants = Object.values(session.participants)
  return (
    participants.length > 0 &&
    participants.every(participant => isParticipantResolved(participant))
  )
}
