import clsx from 'classnames'
import {
  useBoardControlsActions,
  useBoardControlsState,
} from '@/providers/retro-board/controls'

const canReset = true

export function ClosedVote() {
  const { resetVoting } = useBoardControlsActions(a => ({
    resetVoting: a.resetVoting,
  }))
  const { membersVoted } = useBoardControlsState(s => ({
    membersVoted: s.boardControls.voting.collectedVotes,
  }))

  const voted = Object.keys(membersVoted).length

  return (
    <div className='flex justify-between items-center'>
      <div
        className={clsx('flex flex-col items-center', {
          'mx-auto': !canReset,
        })}
      >
        <p className='text-3xl'>{voted}</p>
        <p className='text-sm italic text-text-secondary tracking-tight -mt-1'>
          Voted
        </p>
      </div>
      <div className='flex gap-2 justify-end'>
        {canReset && (
          <button
            onClick={resetVoting}
            className='px-4 py-2 bg-secondary/10 text-text-secondary rounded-md hover:bg-secondary/20 active:bg-secondary/30 transition tracking-wide text-sm cursor-pointer'
          >
            Reset Votes
          </button>
        )}
      </div>
    </div>
  )
}
