'use client'

import { ArrowRight, LogOut } from 'lucide-react'
import { useVotingProgress } from '@/components/board-controls/voting/use-voting-progress'
import { GUIDED_PHASE_ORDER, GuidedPhase } from '@/enums'
import { useModals } from '@/hooks/use-modals'
import { useBoardPermissions } from '@/providers/retro-board/board-settings'
import {
  useBoardControlsActions,
  useBoardControlsState,
} from '@/providers/retro-board/controls'

const BUTTON =
  'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-text-secondary border border-border-light hover:bg-hover transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'

// The facilitator's phase controls, rendered in the header's second row where
// RetroActions normally sits. Non-facilitators see nothing here; their board
// advances when the facilitator moves the group forward.
export function GuidedControls() {
  const { user } = useBoardPermissions()
  const phase = useBoardControlsState(
    s => s.boardControls.guided?.phase ?? GuidedPhase.REFLECT,
  )
  const { setGuidedPhase, endGuidedRetro } = useBoardControlsActions(a => ({
    setGuidedPhase: a.setGuidedPhase,
    endGuidedRetro: a.endGuidedRetro,
  }))
  const { voted, votingMembers } = useVotingProgress()
  const { openModal } = useModals()

  if (!user.hasFacilitator) return

  const index = GUIDED_PHASE_ORDER.indexOf(phase)
  const isLast = index >= GUIDED_PHASE_ORDER.length - 1

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

  return (
    <div className='flex items-center gap-2'>
      {!isLast && (
        <button type='button' onClick={handleNext} className={BUTTON}>
          Next
          <ArrowRight className='size-4' />
        </button>
      )}
      <button
        type='button'
        onClick={endGuidedRetro}
        title='End guided session'
        aria-label='End guided session'
        className={BUTTON}
      >
        <LogOut className='size-4' />
        End
      </button>
    </div>
  )
}
