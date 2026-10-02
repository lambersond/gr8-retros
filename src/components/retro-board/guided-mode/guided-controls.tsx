'use client'

import { ArrowRight, LogOut } from 'lucide-react'
import { useVotingProgress } from '@/components/board-controls/voting/use-voting-progress'
import { GUIDED_PHASE_ORDER, GuidedPhase } from '@/enums'
import { useAuth } from '@/hooks/use-auth'
import { useModals } from '@/hooks/use-modals'
import { useBoardPermissions } from '@/providers/retro-board/board-settings'
import {
  useBoardControlsActions,
  useBoardControlsState,
} from '@/providers/retro-board/controls'

const BUTTON =
  'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-text-secondary border border-border-light hover:bg-hover transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'

const DANGER_BUTTON =
  'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-danger border border-danger/40 hover:bg-danger/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'

// The session lead's phase controls, rendered in the header's second row where
// RetroActions normally sits. Everyone else sees nothing here; their board
// advances when the lead moves the group forward.
export function GuidedControls() {
  const { user } = useBoardPermissions()
  const {
    user: { id: userId },
  } = useAuth()
  const { phase, chosenFacilitatorId } = useBoardControlsState(s => ({
    phase: s.boardControls.guided?.phase ?? GuidedPhase.REFLECT,
    chosenFacilitatorId: s.boardControls.chosenFacilitatorId,
  }))
  const { setGuidedPhase, endGuidedRetro } = useBoardControlsActions(a => ({
    setGuidedPhase: a.setGuidedPhase,
    endGuidedRetro: a.endGuidedRetro,
  }))
  const { voted, votingMembers } = useVotingProgress()
  const { openModal } = useModals()

  const index = GUIDED_PHASE_ORDER.indexOf(phase)
  const isLast = index >= GUIDED_PHASE_ORDER.length - 1
  // A chosen facilitator can advance the phases alongside Facilitator-role
  // users (additive, so the session can't stall if that person drops off).
  // Ending the session stays with the Facilitator role.
  const isChosenFacilitator =
    !!chosenFacilitatorId && chosenFacilitatorId === userId
  const showNext = !isLast && (user.hasFacilitator || isChosenFacilitator)
  const showEnd = user.hasFacilitator

  if (!showNext && !showEnd) return

  const advance = () => setGuidedPhase(GUIDED_PHASE_ORDER[index + 1])

  const handleNext = () => {
    // Warn before leaving the Vote phase while submissions are still missing.
    if (phase === GuidedPhase.VOTE && voted < votingMembers) {
      openModal('ConfirmModal', {
        title: 'Not everyone has voted',
        message: `Only ${voted} of ${votingMembers} have submitted their votes. Move on to Discuss anyway?`,
        confirmButtonText: 'Yes, continue',
        cancelButtonText: 'Keep voting',
        color: 'danger',
        onConfirm: advance,
      })
      return
    }
    advance()
  }

  const handleEnd = () => {
    openModal('ConfirmModal', {
      title: 'End guided session?',
      message:
        'This ends the guided session and returns everyone to the standard board layout.',
      confirmButtonText: 'End session',
      cancelButtonText: 'Stay in guided mode',
      color: 'danger',
      onConfirm: endGuidedRetro,
    })
  }

  return (
    <div className='flex items-center gap-2'>
      {showNext && (
        <button type='button' onClick={handleNext} className={BUTTON}>
          Next
          <ArrowRight className='size-4' />
        </button>
      )}
      {showEnd && (
        <button
          type='button'
          onClick={handleEnd}
          title='End guided session'
          aria-label='End guided session'
          className={DANGER_BUTTON}
        >
          End
          <LogOut className='size-4' />
        </button>
      )}
    </div>
  )
}
