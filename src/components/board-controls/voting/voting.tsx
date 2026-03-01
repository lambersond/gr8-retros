import { ActiveVote } from './active-vote'
import { ClosedVote } from './closed-vote'
import { StartVote } from './start-vote'
import { VotingState } from '@/enums'
import { useBoardControlsState } from '@/providers/retro-board/controls'

export function Voting() {
  const votingState = useBoardControlsState(s => s.boardControls.voting.state)

  switch (votingState) {
    case VotingState.IDLE: {
      return <StartVote />
    }
    case VotingState.OPEN: {
      return <ActiveVote />
    }
    case VotingState.CLOSED: {
      return <ClosedVote />
    }
    default: {
      return (
        <div className='text-sm italic text-text-secondary tracking-tight'>
          You cannot handle the vote
        </div>
      )
    }
  }
}
