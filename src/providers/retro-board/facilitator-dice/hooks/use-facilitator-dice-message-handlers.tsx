import { useMemo } from 'react'
import { FacilitatorDiceMessageType } from '../enums'
import { useFacilitatorDiceDispatch } from '../provider'
import { useDice } from '@/hooks/dice'
import { useAuth } from '@/hooks/use-auth'
import type { DiceSession } from '../types'

export function useFacilitatorDiceMessageHandlers() {
  const dispatch = useFacilitatorDiceDispatch()
  const { roll } = useDice()
  const { user } = useAuth()

  return useMemo(() => {
    const handlers: Record<FacilitatorDiceMessageType, (data: any) => void> = {
      [FacilitatorDiceMessageType.DICE_SESSION_START]: data => {
        dispatch({
          type: FacilitatorDiceMessageType.DICE_SESSION_START,
          session: data.payload.session as DiceSession,
        })
      },
      [FacilitatorDiceMessageType.DICE_ROLL_RESULT]: data => {
        const color = data.payload.color as string
        const result = data.payload.result as number
        const clientId = data.payload.clientId as string

        if (clientId === user.id) return

        roll(`1d20@${result}`, { themeColor: color })

        dispatch({
          type: FacilitatorDiceMessageType.DICE_ROLL_RESULT,
          clientId,
          result,
          color,
        })
      },
    }
    return handlers
  }, [dispatch, roll, user.id])
}
