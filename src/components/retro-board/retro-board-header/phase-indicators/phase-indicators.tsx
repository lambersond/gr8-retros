'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Eraser, Play } from 'lucide-react'
import { Tooltip } from '@/components/common'
import { VotingState } from '@/enums'
import { useAuth } from '@/hooks/use-auth'
import { useModals } from '@/hooks/use-modals'
import {
  useBoardPermissions,
  useBoardSettings,
} from '@/providers/retro-board/board-settings'
import {
  useBoardControlsActions,
  useBoardControlsState,
} from '@/providers/retro-board/controls'

export function PhaseIndicators() {
  const { votingState, isFacilitatorMode, chosenFacilitatorId, hasVoted } =
    useBoardControlsState(s => ({
      votingState: s.boardControls.voting.state,
      isFacilitatorMode: s.boardControls.facilitatorMode.isActive,
      chosenFacilitatorId: s.boardControls.chosenFacilitatorId,
      hasVoted: s.hasVoted,
    }))
  const { toggleFacilitatorMode, undoVoteSubmission } = useBoardControlsActions(
    a => ({
      toggleFacilitatorMode: a.toggleFacilitatorMode,
      undoVoteSubmission: a.undoVoteSubmission,
    }),
  )
  const { settings } = useBoardSettings()
  const { user: roleUser } = useBoardPermissions()
  const { user } = useAuth()
  const { openModal } = useModals()

  const isVotingActive = votingState === VotingState.OPEN
  const isVotingClosed = votingState === VotingState.CLOSED
  const isFacilitatorModeEnabled = settings.facilitatorMode.enabled
  const isChosenFacilitator =
    !!chosenFacilitatorId && chosenFacilitatorId === user.id

  const canStartDiscussions = useMemo(() => {
    if (!isVotingClosed || !isFacilitatorModeEnabled || isFacilitatorMode) {
      return false
    }
    if (chosenFacilitatorId) return isChosenFacilitator
    return roleUser.hasFacilitator
  }, [
    isVotingClosed,
    isFacilitatorModeEnabled,
    isFacilitatorMode,
    chosenFacilitatorId,
    isChosenFacilitator,
    roleUser.hasFacilitator,
  ])

  const shouldPromptChosenFacilitator =
    isVotingClosed &&
    isFacilitatorModeEnabled &&
    !isFacilitatorMode &&
    isChosenFacilitator

  const hasPromptedRef = useRef(false)
  useEffect(() => {
    if (!shouldPromptChosenFacilitator) {
      hasPromptedRef.current = false
      return
    }
    if (hasPromptedRef.current) return
    hasPromptedRef.current = true
    openModal('ConfirmModal', {
      title: 'Start Discussions',
      message:
        'Voting is closed. As the chosen facilitator, would you like to start discussions and begin reviewing the cards?',
      confirmButtonText: 'Start Discussions',
      cancelButtonText: 'Later',
      onConfirm: toggleFacilitatorMode,
    })
  }, [shouldPromptChosenFacilitator, openModal, toggleFacilitatorMode])

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
      {isVotingActive && hasVoted && (
        <>
          <PhaseChip
            label='Votes Submitted'
            tooltip='Your votes have been submitted for this round.'
            className='bg-success/10 text-success border-success/30'
          />
          <Tooltip
            title='Undo your submission and edit your votes'
            placement='bottom'
            asChild
          >
            <button
              type='button'
              onClick={undoVoteSubmission}
              className='flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border bg-danger/10 text-danger border-danger/30 hover:bg-danger/20 cursor-pointer'
            >
              <Eraser size={12} />
              Reset My Votes
            </button>
          </Tooltip>
        </>
      )}
      {isVotingClosed && (
        <>
          <PhaseChip
            label='Voting is Closed'
            tooltip='Voting is now closed. Make sure to reset voting to add more cards.'
            className='bg-warning/10 text-warning border-warning/30'
          />
          {canStartDiscussions && (
            <Tooltip
              title='Begin reviewing cards in facilitation mode'
              placement='bottom'
              asChild
            >
              <button
                type='button'
                onClick={toggleFacilitatorMode}
                className='flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border bg-info/10 text-info border-info/30 hover:bg-info/20 cursor-pointer'
              >
                <Play size={12} className='fill-current' />
                Start Discussions
              </button>
            </Tooltip>
          )}
        </>
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
