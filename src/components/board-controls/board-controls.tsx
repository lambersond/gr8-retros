'use client'

import { Vote } from 'lucide-react'
import { Popover } from '../common'
import { BoardControlItem } from './board-control-item'
import { FacilitateSessionButton } from './facilitate'
import { StartGuidedRetroButton } from './guided'
import {
  MusicStatus,
  TimeRemaining,
  VotesRemaining,
  VotesSubmitted,
} from './indicators'
import { AudioRefs, MusicControls, VolumeControl } from './music'
import { TimerInputs } from './timer'
import { Voting, VotingConfig } from './voting'
import { VotingProgressBar } from './voting/voting-progress-bar'
import { GuidedPhase, VotingState } from '@/enums'
import { useAuth } from '@/hooks/use-auth'
import {
  useBoardPermissions,
  useBoardSettings,
} from '@/providers/retro-board/board-settings'
import {
  useBoardControlsActions,
  useBoardControlsState,
} from '@/providers/retro-board/controls'

const getHeaderLabel = (
  timerEnabled: boolean,
  musicEnabled: boolean,
  votingEnabled = false,
) => {
  const parts = [
    timerEnabled && 'Timer',
    musicEnabled && 'Music',
    votingEnabled && 'Voting',
  ].filter(Boolean) as string[]

  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0]
  return `${parts.slice(0, -1).join(', ')}, and ${parts.at(-1)}`
}

export function BoardControls() {
  const { user, userPermissions } = useBoardPermissions()
  const {
    user: { id: userId },
  } = useAuth()
  const { settings } = useBoardSettings()
  const {
    isFacilitatorMode,
    votingState,
    guidedActive,
    guidedPhase,
    chosenFacilitatorId,
  } = useBoardControlsState(s => ({
    isFacilitatorMode: s.boardControls.facilitatorMode.isActive,
    votingState: s.boardControls.voting.state,
    guidedActive: !!s.boardControls.guided?.isActive,
    guidedPhase: s.boardControls.guided?.phase,
    chosenFacilitatorId: s.boardControls.chosenFacilitatorId,
  }))
  const { toggleFacilitatorMode, startGuidedRetro } = useBoardControlsActions(
    a => ({
      toggleFacilitatorMode: a.toggleFacilitatorMode,
      startGuidedRetro: a.startGuidedRetro,
    }),
  )
  const canFacilitate = user.hasFacilitator
  const isVotingOpen = votingState === VotingState.OPEN
  const inGuidedVote = guidedActive && guidedPhase === GuidedPhase.VOTE
  // Timer and music stay available in every phase. The participant voting UI
  // (vote indicator + "Cast My Votes") shows in the normal flow when voting is
  // enabled, and always during the guided Vote phase — that phase forces a
  // voting session open regardless of the board's voting setting, so the
  // controls follow it rather than the (possibly disabled) setting.
  const showVoting =
    !isFacilitatorMode &&
    (inGuidedVote || (!guidedActive && settings.voting.enabled))
  // The manual open/close/config popover belongs to the non-guided flow only.
  // In guided mode the phase controls drive voting, so it must never surface the
  // manual "End Vote" path, which would call closeVoting() and bypass the phase
  // machine, leaving the guided phase stuck on Vote.
  const showVotingControls = showVoting && !guidedActive
  // Guided mode still lets the session lead tune the vote: votes-per-user and
  // single/multi mode, without any start/end button (the phase machine owns
  // that). Available through Reflect, Group, and Vote so it can be set before
  // the vote opens; once Discuss closes the vote there's nothing to tune. A
  // chosen facilitator takes over exclusively, otherwise it falls back to the
  // Facilitator role (same rule as PhaseIndicators' discussion handoff).
  const leadsSession = chosenFacilitatorId
    ? chosenFacilitatorId === userId
    : user.hasFacilitator
  const showGuidedVoteConfig =
    guidedActive && guidedPhase !== GuidedPhase.DISCUSS && leadsSession
  // The normal flow shows voted/voting counts in the popover's ActiveVote,
  // which guided mode hides. So whoever can move the group on from the Vote
  // phase (same rule as the guided Next button) gets the exact count beside
  // the vote icon instead.
  const canAdvanceGuided =
    user.hasFacilitator ||
    (!!chosenFacilitatorId && chosenFacilitatorId === userId)
  const showGuidedVoteCount = inGuidedVote && isVotingOpen && canAdvanceGuided
  const showFacilitate =
    !guidedActive &&
    canFacilitate &&
    !isVotingOpen &&
    settings.facilitatorMode.enabled
  const showGuided =
    !guidedActive &&
    canFacilitate &&
    !isVotingOpen &&
    !isFacilitatorMode &&
    settings.guidedMode.enabled
  const shouldRender =
    settings.timer.enabled ||
    settings.music.enabled ||
    showVoting ||
    showFacilitate ||
    showGuided ||
    showGuidedVoteConfig
  const showPopover =
    settings.music.enabled ||
    (settings.timer.enabled &&
      userPermissions['timer.restricted.canControl']) ||
    showFacilitate ||
    showGuided ||
    showGuidedVoteConfig
  const canVote = userPermissions['voting.restricted.canVote']
  const showVotesRemaining = showVoting && canVote
  // Keep the pill from rendering empty for the session lead before the vote
  // opens (e.g. timer and music both off): show an idle vote icon to open it.
  const showIdleVoteIcon = showGuidedVoteConfig && !showVotesRemaining

  if (!shouldRender) return
  return (
    <div className='flex justify-center'>
      <div className='relative overflow-hidden py-1 px-2 bg-info/20 w-fit rounded-md flex items-center'>
        {settings.music.enabled && <AudioRefs />}
        <Popover
          asChild
          hidePopover={!showPopover}
          content={
            <div className='min-w-44 bg-paper rounded-xl flex flex-col border border-tertiary mt-2 shadow [&>*:last-child]:border-b-0'>
              <BoardControlItem>
                <p className='font-bold tracking-tight text-text-primary'>
                  {getHeaderLabel(
                    settings.timer.enabled,
                    settings.music.enabled,
                    showVotingControls || showGuidedVoteConfig,
                  )}
                </p>
              </BoardControlItem>
              {settings.music.enabled && (
                <BoardControlItem>
                  <VolumeControl />
                </BoardControlItem>
              )}
              {userPermissions['timer.restricted.canControl'] &&
                settings.timer.enabled && (
                  <BoardControlItem className='flex flex-col gap-2'>
                    <TimerInputs />
                  </BoardControlItem>
                )}
              {userPermissions['music.restricted.canControl'] &&
                settings.music.enabled && (
                  <BoardControlItem className='flex gap-2 items-center'>
                    <MusicControls />
                  </BoardControlItem>
                )}
              {showVotingControls && (
                <BoardControlItem>
                  <Voting />
                </BoardControlItem>
              )}
              {showGuidedVoteConfig && (
                <BoardControlItem>
                  <VotingConfig />
                </BoardControlItem>
              )}
              {showFacilitate && (
                <BoardControlItem className='flex items-center gap-2'>
                  <FacilitateSessionButton
                    isFacilitatorMode={isFacilitatorMode}
                    onToggle={toggleFacilitatorMode}
                  />
                </BoardControlItem>
              )}
              {showGuided && (
                <BoardControlItem className='flex items-center gap-2'>
                  <StartGuidedRetroButton onStart={startGuidedRetro} />
                </BoardControlItem>
              )}
            </div>
          }
        >
          <div
            id='board-controls-indicators'
            className='text-xl font-mono text-center select-none z-10 flex items-center gap-2'
          >
            {showVotesRemaining && <VotesRemaining />}
            {showIdleVoteIcon && <Vote className='text-text-secondary' />}
            {showGuidedVoteCount && <VotesSubmitted />}
            {settings.timer.enabled && <TimeRemaining />}
            {settings.music.enabled && <MusicStatus />}
          </div>
        </Popover>
        {isVotingOpen && <VotingProgressBar />}
      </div>
    </div>
  )
}
