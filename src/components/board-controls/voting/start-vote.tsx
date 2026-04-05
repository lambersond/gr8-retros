import {
  Checkbox,
  NumberIncrementor,
  usePopover,
} from '@/components/common'
import { VotingMode } from '@/enums'
import {
  useBoardControlsActions,
  useBoardControlsState,
} from '@/providers/retro-board/controls'

export function StartVote() {
  const { votingMode, votingLimit } = useBoardControlsState(s => ({
    votingMode: s.boardControls.voting.mode,
    votingLimit: s.boardControls.voting.limit,
  }))

  const { setVotingLimit, setVotingMode, openVoting } = useBoardControlsActions(
    a => ({
      setVotingLimit: a.setVotingLimit,
      setVotingMode: a.setVotingMode,
      openVoting: a.openVoting,
    }),
  )

  const popover = usePopover()

  const isMultiMode = votingMode === VotingMode.MULTI

  const handleMultiModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVotingMode(e.target.checked ? VotingMode.MULTI : VotingMode.SINGLE)
  }

  const handleStartVoting = () => {
    openVoting()
    popover.setOpen(false)
  }

  return (
    <div className='flex flex-col gap-2'>
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
          checked={isMultiMode}
        />
      </div>
      <button
        onClick={handleStartVoting}
        className='px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 active:bg-primary/80 transition tracking-wide text-sm cursor-pointer'
      >
        Start Voting
      </button>
    </div>
  )
}
