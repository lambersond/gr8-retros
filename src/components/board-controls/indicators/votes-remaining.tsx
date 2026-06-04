import clsx from 'clsx'
import { Vote } from 'lucide-react'
import { IAmDoneButton } from '@/components/i-am-done-button'
import { VotingState } from '@/enums'
import { useBoardControlsState } from '@/providers/retro-board/controls'

export function VotesRemaining() {
  const { votesMax, votingState, votesUsed } = useBoardControlsState(s => ({
    votesMax: s.boardControls.voting.limit,
    votingState: s.boardControls.voting.state,
    votesUsed: s.votes.length,
  }))

  const isVotingIdle = votingState === VotingState.IDLE
  const isVotingOpen = votingState === VotingState.OPEN
  const isVotingClosed = votingState === VotingState.CLOSED

  return (
    <div>
      <div className='flex items-center'>
        <Vote
          className={clsx({
            'text-primary': isVotingOpen,
            'text-warning': isVotingClosed,
            'text-text-secondary': isVotingIdle,
          })}
        />
      </div>
      {isVotingOpen && (
        <IAmDoneButton showBounceAnimation={votesUsed === votesMax} />
      )}
    </div>
  )
}
