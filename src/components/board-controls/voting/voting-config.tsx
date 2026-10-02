import { Checkbox, NumberIncrementor } from '@/components/common'
import { VotingMode } from '@/enums'
import {
  useBoardControlsActions,
  useBoardControlsState,
} from '@/providers/retro-board/controls'

// Votes-per-user and single/multi mode. Shared by StartVote (manual flow, set
// before opening a vote) and guided mode, where the phase machine opens voting
// itself so only the configuration is surfaced — never a start/end button.
export function VotingConfig() {
  const { votingMode, votingLimit } = useBoardControlsState(s => ({
    votingMode: s.boardControls.voting.mode,
    votingLimit: s.boardControls.voting.limit,
  }))
  const { setVotingLimit, setVotingMode } = useBoardControlsActions(a => ({
    setVotingLimit: a.setVotingLimit,
    setVotingMode: a.setVotingMode,
  }))

  const handleMultiModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVotingMode(e.target.checked ? VotingMode.MULTI : VotingMode.SINGLE)
  }

  return (
    <div className='flex items-start justify-between'>
      <div className='flex flex-col'>
        <p className='text-sm text-text-secondary tracking-tight italic'>
          Votes Per User
        </p>
        <NumberIncrementor value={votingLimit} onChange={setVotingLimit} />
      </div>
      <Checkbox
        label='Multi-mode'
        size='lg'
        direction='vertical'
        textDirection='start'
        labelClassName='italic text-sm text-text-secondary'
        onChange={handleMultiModeChange}
        info='Multi-mode allows users to vote for the same item multiple times. Single-mode allows only one vote per item.'
        checked={votingMode === VotingMode.MULTI}
      />
    </div>
  )
}
