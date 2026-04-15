import { useCallback } from 'react'
import { useChannel } from 'ably/react'
import { useParams } from 'next/navigation'
import { FacilitatorDiceMessageType } from '../enums'
import { useFacilitatorDiceDispatch } from '../provider'
import { BoardRole } from '@/enums'
import { useDice } from '@/hooks/dice'
import { useAuth } from '@/hooks/use-auth'
import { hasMinimumRole } from '@/lib/roles'
import { useViewingMembers } from '@/providers/viewing-members'
import type { DiceParticipant, DiceSession } from '../types'

export function useFacilitatorDiceActions() {
  const { id: boardId } = useParams() satisfies { id: string }
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
        payload: { session },
      },
    })

    return session.sessionId
  }, [viewingMembers, user.id, dispatch, publish])

  const submitRoll = useCallback(
    async (color: string) => {
      const results = await roll('1d20', { themeColor: color })
      const result = results[0] ?? 1

      dispatch({
        type: FacilitatorDiceMessageType.DICE_ROLL_RESULT,
        clientId: user.id,
        result,
        color,
      })

      publish({
        data: {
          type: FacilitatorDiceMessageType.DICE_ROLL_RESULT,
          payload: { clientId: user.id, result, color },
        },
      })
    },
    [user.id, roll, dispatch, publish],
  )

  return { startSession, submitRoll }
}
