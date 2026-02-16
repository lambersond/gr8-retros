import { noop } from 'lodash'
import { ActiveVote } from './active-vote'
import { ClosedVote } from './closed-vote'
import { StartVote } from './start-vote'
import { VotingState } from '@/enums'

// Placeholder until we have the voting system implemented more fully
const votingState: VotingState = VotingState.OPEN

export function Voting() {
  switch (votingState) {
    case VotingState.IDLE: {
      return <StartVote />
    }
    case VotingState.OPEN: {
      return <ActiveVote voting={2} voted={7} />
    }
    case VotingState.CLOSED: {
      return <ClosedVote voted={8} onResults={noop} onReset={noop} />
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
