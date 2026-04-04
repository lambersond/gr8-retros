import clsx from 'clsx'
import { Vote } from 'lucide-react'
import { Tooltip } from '@/components/common'
import { IAmDoneButton } from '@/components/i-am-done-button'
import { VotingState } from '@/enums'
import { useModals } from '@/hooks/use-modals'
import {
  useBoardControlsActions,
  useBoardControlsState,
} from '@/providers/retro-board/controls'

export function VotesRemaining() {
  const { openModal } = useModals()
  const { votesMax, votingState, hasVoted, votesUsed } = useBoardControlsState(
    s => ({
      votesMax: s.boardControls.voting.limit,
      votingState: s.boardControls.voting.state,
      hasVoted: s.hasVoted,
      votesUsed: s.votes.length,
    }),
  )
  const { resetMyVotes } = useBoardControlsActions(a => ({
    resetMyVotes: a.clearMyVotes,
  }))

  const isVotingIdle = votingState === VotingState.IDLE
  const isVotingOpen = votingState === VotingState.OPEN
  const isVotingClosed = votingState === VotingState.CLOSED
  const formatted = `${votesMax - votesUsed}/${votesMax}`

  let tooltipTitle: string
  if (isVotingOpen && !hasVoted) {
    tooltipTitle = `You have ${votesMax - votesUsed} votes remaining`
  } else if (isVotingOpen && hasVoted) {
    tooltipTitle = 'You have voted. Click to reset your votes.'
  } else {
    tooltipTitle = 'Voting is closed'
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (hasVoted) {
      openModal('ConfirmModal', {
        color: 'danger',
        title: 'Reset Your Votes?',
        message: 'Are you sure you want to reset your votes?',
        confirmButtonText: 'Yes, reset my votes',
        cancelButtonText: 'No',
        onConfirm: () => {
          resetMyVotes()
        },
      })
    }
  }

  return (
    <div
      className={clsx({
        '-ml-2': isVotingIdle,
      })}
    >
      {isVotingOpen && (
        <>
          <Tooltip title={tooltipTitle} asChild>
            <button
              onClick={handleClick}
              className={clsx(
                'flex items-center gap-1 text-sm italic tracking-tight text-center',
                {
                  'text-text-secondary cursor-pointer': hasVoted,
                  'text-primary': !hasVoted,
                },
              )}
            >
              <Vote /> {formatted}
            </button>
          </Tooltip>
          <IAmDoneButton showBounceAnimation={votesUsed === votesMax} />
        </>
      )}
      {isVotingClosed && (
        <div className='flex items-center gap-1 text-sm italic tracking-tight text-center text-text-secondary'>
          <Tooltip title={tooltipTitle} asChild>
            <Vote />
          </Tooltip>
        </div>
      )}
    </div>
  )
}
