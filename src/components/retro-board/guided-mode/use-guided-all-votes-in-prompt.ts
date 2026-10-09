'use client'

import { useGuidedPhaseTransition } from './use-guided-phase-transition'
import { useAllVotesInPrompt } from '@/components/board-controls/voting/use-all-votes-in-prompt'
import { GuidedPhase } from '@/enums'
import { useBoardControlsState } from '@/providers/retro-board/controls'

// The guided Vote phase's "All votes are in": offers the chosen facilitator
// the move on to Discuss. Stay in Voting only dismisses this one prompt; it
// comes back if the count drops and everyone is in again.
export function useGuidedAllVotesInPrompt() {
  const isVotePhase = useBoardControlsState(
    s => s.boardControls.guided?.phase === GuidedPhase.VOTE,
  )
  const transition = useGuidedPhaseTransition()

  useAllVotesInPrompt({
    guided: true,
    enabled: isVotePhase,
    buildPrompt: votingMembers => {
      const everyone =
        votingMembers === 1
          ? 'The only participant has'
          : `All ${votingMembers} participants have`
      return {
        title: 'All votes are in',
        message: `${everyone} submitted their votes. Ready to discuss the cards?`,
        confirmButtonText: 'Discuss Cards',
        cancelButtonText: 'Stay in Voting',
        color: 'primary',
        onConfirm: () => transition(GuidedPhase.VOTE, GuidedPhase.DISCUSS),
      }
    },
  })
}
