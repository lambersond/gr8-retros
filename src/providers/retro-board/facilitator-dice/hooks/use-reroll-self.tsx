import { useCallback } from 'react'
import { FacilitatorDiceInternalAction } from '../enums'
import { useFacilitatorDiceDispatch } from '../provider'
import { useFacilitatorDiceActions } from './use-facilitator-dice-actions'
import { useAuth } from '@/hooks/use-auth'
import { useModals } from '@/hooks/use-modals'

/**
 * Rerolls only the current user within the active session: clears their own
 * result/DNR locally and reopens the dice picker. Never starts a new session,
 * so other participants' rolls and the session itself are untouched.
 */
export function useRerollSelf() {
  const dispatch = useFacilitatorDiceDispatch()
  const { submitRoll, submitDnr } = useFacilitatorDiceActions()
  const { user } = useAuth()
  const { openModal } = useModals()

  return useCallback(() => {
    dispatch({
      type: FacilitatorDiceInternalAction.CLEAR_DNR,
      clientId: user.id,
    })
    openModal('DiceColorPickerModal', { submitRoll, onDnr: submitDnr })
  }, [dispatch, user.id, openModal, submitRoll, submitDnr])
}
