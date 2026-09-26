'use client'

import { Eraser } from 'lucide-react'
import { VotingState } from '@/enums'
import {
  useBoardControlsActions,
  useBoardControlsState,
} from '@/providers/retro-board/controls'

// Guided mode replaces the header's PhaseIndicators (which carries the
// "Reset My Votes" control in the regular board) with the phase flow, so this
// restores a way to undo a submission. It mirrors the "I'm done" button's
// top-center slot and only appears once the current user has submitted.
export function GuidedResetVotesButton() {
  const { votingOpen, hasVoted } = useBoardControlsState(s => ({
    votingOpen: s.boardControls.voting.state === VotingState.OPEN,
    hasVoted: s.hasVoted,
  }))
  const undoVoteSubmission = useBoardControlsActions(a => a.undoVoteSubmission)

  if (!votingOpen || !hasVoted) return

  return (
    <button
      type='button'
      onClick={undoVoteSubmission}
      className='flex gap-2 items-center px-4 py-2 text-sm font-bold bg-danger text-white rounded-md hover:bg-danger/90 active:bg-danger/80 tracking-tight fixed top-3.5 left-1/2 -translate-x-1/2 z-50 cursor-pointer scale-75 origin-center'
    >
      <Eraser className='size-5' />
      Reset my votes
    </button>
  )
}
