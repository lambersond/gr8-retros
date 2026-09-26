'use client'

import { Popover } from '../common'
import { BoardControlItem } from './board-control-item'
import { FacilitateSessionButton } from './facilitate'
import { StartGuidedRetroButton } from './guided'
import { MusicStatus, TimeRemaining, VotesRemaining } from './indicators'
import { AudioRefs, MusicControls, VolumeControl } from './music'
import { TimerInputs } from './timer'
import { Voting } from './voting'
import { VotingProgressBar } from './voting/voting-progress-bar'
import { GuidedPhase, VotingState } from '@/enums'
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
  guidedEnabled = false,
) => {
  const parts = [
    timerEnabled && 'Timer',
    musicEnabled && 'Music',
    votingEnabled && 'Voting',
    guidedEnabled && 'Guided',
  ].filter(Boolean) as string[]

  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0]
  return `${parts.slice(0, -1).join(', ')}, and ${parts.at(-1)}`
}

export function BoardControls() {
  const { user, userPermissions } = useBoardPermissions()
  const { settings } = useBoardSettings()
  const { isFacilitatorMode, votingState, guidedActive, guidedPhase } =
    useBoardControlsState(s => ({
      isFacilitatorMode: s.boardControls.facilitatorMode.isActive,
      votingState: s.boardControls.voting.state,
      guidedActive: !!s.boardControls.guided?.isActive,
      guidedPhase: s.boardControls.guided?.phase,
    }))
  const { toggleFacilitatorMode, startGuidedRetro } = useBoardControlsActions(
    a => ({
      toggleFacilitatorMode: a.toggleFacilitatorMode,
      startGuidedRetro: a.startGuidedRetro,
    }),
  )
  const canFacilitate = user.hasFacilitator
  const isVotingOpen = votingState === VotingState.OPEN
  // Timer and music stay available in every phase. During a guided session the
  // guided flow drives voting (only surfaced here in the Vote phase) and hides
  // the manual Facilitate / Start Guided buttons.
  const showVoting =
    settings.voting.enabled &&
    !isFacilitatorMode &&
    (!guidedActive || guidedPhase === GuidedPhase.VOTE)
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
    showGuided
  const showPopover =
    settings.music.enabled ||
    (settings.timer.enabled &&
      userPermissions['timer.restricted.canControl']) ||
    showFacilitate ||
    showGuided
  const canVote = userPermissions['voting.restricted.canVote']

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
                    showVoting,
                    showGuided,
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
              {showVoting && (
                <BoardControlItem>
                  <Voting />
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
            {showVoting && canVote && <VotesRemaining />}
            {settings.timer.enabled && <TimeRemaining />}
            {settings.music.enabled && <MusicStatus />}
          </div>
        </Popover>
        {isVotingOpen && <VotingProgressBar />}
      </div>
    </div>
  )
}
