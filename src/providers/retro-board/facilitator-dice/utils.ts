import { BoardRole } from '@/enums'
import { hasMinimumRole } from '@/lib/roles'
import type { DiceParticipant, DiceSession } from './types'
import type { ViewingMembers } from '@/providers/viewing-members'
import type { BoardMember } from '@/types'

/**
 * Viewers who can facilitate: everyone currently on the board (presence) whose
 * role is Facilitator or above.
 *
 * The role comes from the board's member list, which every client keeps live
 * from server-published membership messages. The role a client self-reports in
 * presence only changes once that client has processed its own promotion and
 * re-announced itself, so it can lag behind. It is only used as a fallback for
 * viewers who aren't board members (e.g. guests).
 */
export function getFacilitatorCandidates(
  viewingMembers: ViewingMembers,
  boardMembers: BoardMember[],
): DiceParticipant[] {
  const roleByUserId = new Map(
    boardMembers.map(member => [member.user.id, member.role]),
  )

  return Object.entries(viewingMembers)
    .filter(([clientId, viewer]) =>
      hasMinimumRole(
        BoardRole.FACILITATOR,
        roleByUserId.get(clientId) ?? viewer.role,
      ),
    )
    .map(([clientId, viewer]) => ({
      clientId,
      name: viewer.name,
      image: viewer.image,
    }))
}

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
