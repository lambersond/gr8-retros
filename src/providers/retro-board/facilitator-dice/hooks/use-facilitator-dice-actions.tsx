import { useCallback } from 'react'
import {
  executeRoll,
  toDiceBoxNotation,
  type DieSides,
} from '@lambersond/3d-dice-core'
import { useAbly, useChannel } from 'ably/react'
import { useParams } from 'next/navigation'
import { FacilitatorDiceMessageType } from '../enums'
import { useFacilitatorDiceDispatch } from '../provider'
import { BoardRole } from '@/enums'
import { useDice } from '@/hooks/dice'
import { useAuth } from '@/hooks/use-auth'
import { hasMinimumRole } from '@/lib/roles'
import { useViewingMembers } from '@/providers/viewing-members'
import type { DiceParticipant, DiceSession } from '../types'

// ─── TEMPORARY EASTER EGG ────────────────────────────────────────────────────
// dbenson rolls a d100 (and therefore basically always wins). To remove: delete
// this block, drop `type DieSides` from the core import above, and inline
// `sides: 20` in the executeRoll call below.
const EASTER_EGG_EMAIL = 'dbenson@rise8.us'
const facilitatorDieSides = (email: string): DieSides =>
  email === EASTER_EGG_EMAIL ? 100 : 20
// ─── END TEMPORARY EASTER EGG ────────────────────────────────────────────────

export function useFacilitatorDiceActions() {
  const { id: boardId } = useParams() satisfies { id: string }
  const ably = useAbly()
  const { publish } = useChannel(boardId)
  const dispatch = useFacilitatorDiceDispatch()
  const { viewingMembers } = useViewingMembers()
  const { user } = useAuth()
  const { roll } = useDice()

  const startSession = useCallback(() => {
    const participants: Record<string, DiceParticipant> = {}

    for (const [clientId, member] of Object.entries(viewingMembers)) {
      if (hasMinimumRole(BoardRole.FACILITATOR, member.role)) {
        participants[clientId] = {
          clientId,
          name: member.name,
          image: member.image,
        }
      }
    }

    const session: DiceSession = {
      sessionId: crypto.randomUUID(),
      initiatorClientId: user.id,
      participants,
    }

    dispatch({
      type: FacilitatorDiceMessageType.DICE_SESSION_START,
      session,
    })
    publish({
      data: {
        type: FacilitatorDiceMessageType.DICE_SESSION_START,
        payload: { session, connectionId: ably.connection.id },
      },
    })

    return session.sessionId
  }, [viewingMembers, user.id, dispatch, publish, ably.connection.id])

  const submitRoll = useCallback(
    async (color: string) => {
      // Deterministic roll: decide the value up front with an RNG (guaranteed
      // and instant) so the dice log always populates and every client syncs to
      // the same number — then animate the die to that forced landing. The
      // result never depends on the physics settling.
      const rolled = executeRoll({
        pools: [{ sides: facilitatorDieSides(user.email), count: 1 }],
        modifier: 0,
      })
      const result = rolled.total

      dispatch({
        type: FacilitatorDiceMessageType.DICE_ROLL_RESULT,
        clientId: user.id,
        result,
        color,
      })

      publish({
        data: {
          type: FacilitatorDiceMessageType.DICE_ROLL_RESULT,
          payload: {
            clientId: user.id,
            result,
            color,
            connectionId: ably.connection.id,
          },
        },
      })

      await roll(toDiceBoxNotation(rolled), { themeColor: color })
    },
    [user.id, user.email, roll, dispatch, publish, ably.connection.id],
  )

  const submitDnr = useCallback(() => {
    dispatch({
      type: FacilitatorDiceMessageType.DICE_DNR_RESULT,
      clientId: user.id,
    })

    publish({
      data: {
        type: FacilitatorDiceMessageType.DICE_DNR_RESULT,
        payload: { clientId: user.id, connectionId: ably.connection.id },
      },
    })
  }, [user.id, dispatch, publish, ably.connection.id])

  return { startSession, submitRoll, submitDnr }
}
