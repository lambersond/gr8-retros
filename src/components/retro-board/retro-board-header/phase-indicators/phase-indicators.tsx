'use client'

import { Tooltip } from '@/components/common'
import { VotingState } from '@/enums'
import { useBoardControlsState } from '@/providers/retro-board/controls'

export function PhaseIndicators() {
  const { votingState, isFacilitatorMode } = useBoardControlsState(s => ({
    votingState: s.boardControls.voting.state,
    isFacilitatorMode: s.boardControls.facilitatorMode.isActive,
  }))

  const isVotingActive = votingState === VotingState.OPEN
  const isVotingClosed = votingState === VotingState.CLOSED

  if (!isVotingActive && !isVotingClosed && !isFacilitatorMode) return

  return (
    <div className='flex items-center gap-2'>
      {isVotingActive && (
        <PhaseChip
          label='Voting is Active'
          tooltip="Make sure to submit your vote when you are finished by pressing the I'm Done button"
          className='bg-primary/10 text-primary border-primary/30'
        />
      )}
      {isVotingClosed && (
        <PhaseChip
          label='Voting is Closed'
          tooltip='Voting is now closed. Make sure to reset voting to add more cards.'
          className='bg-warning/10 text-warning border-warning/30'
        />
      )}
      {isFacilitatorMode && (
        <PhaseChip
          label='Facilitation Mode is Active'
          tooltip='Facilitation Session is now active, to return to Column Mode remember to end the Facilitation Session.'
          className='bg-info/10 text-info border-info/30'
        />
      )}
    </div>
  )
}

function PhaseChip({
  label,
  tooltip,
  className,
}: Readonly<{ label: string; tooltip: string; className: string }>) {
  return (
    <Tooltip title={tooltip} placement='bottom' asChild>
      <button
        type='button'
        className={`px-2 py-0.5 text-xs font-medium rounded-full border cursor-default ${className}`}
      >
        {label}
      </button>
    </Tooltip>
  )
}
