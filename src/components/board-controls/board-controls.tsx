'use client'

import { Presentation } from 'lucide-react'
import { Popover, usePopoverContext } from '../common'
import { BoardControlItem } from './board-control-item'
import { MusicStatus, TimeRemaining, VotesRemaining } from './indicators'
import { AudioRefs, MusicControls, VolumeControl } from './music'
import { TimerInputs } from './timer'
import { Voting } from './voting'
import { VotingState } from '@/enums'
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

function FacilitateSessionButton({
  isFacilitatorMode,
  onToggle,
}: {
  isFacilitatorMode: boolean
  onToggle: () => void
}) {
  const popover = usePopoverContext()
  const handleClick = () => {
    onToggle()
    popover.setOpen(false)
  }

  return (
    <button
      onClick={handleClick}
      className='flex items-center gap-2 w-full text-sm font-semibold cursor-pointer rounded-md px-2 py-1.5 transition-colors hover:bg-primary/10'
    >
      <Presentation className='size-4' />
      {isFacilitatorMode ? 'End Session' : 'Facilitate Session'}
    </button>
  )
}

export function BoardControls() {
  const { user, userPermissions } = useBoardPermissions()
  const { settings } = useBoardSettings()
  const { isFacilitatorMode, votingState } = useBoardControlsState(s => ({
    isFacilitatorMode: s.boardControls.facilitatorMode.isActive,
    votingState: s.boardControls.voting.state,
  }))
  const toggleFacilitatorMode = useBoardControlsActions(
    a => a.toggleFacilitatorMode,
  )
  const canFacilitate = user.hasFacilitator
  const isVotingOpen = votingState === VotingState.OPEN
  const showVoting = settings.voting.enabled && !isFacilitatorMode
  const showFacilitate = canFacilitate && !isVotingOpen
  const shouldRender =
    settings.timer.enabled ||
    settings.music.enabled ||
    showVoting ||
    showFacilitate
  const showPopover =
    settings.music.enabled ||
    (settings.timer.enabled &&
      userPermissions['timer.restricted.canControl']) ||
    showFacilitate
  const canVote = userPermissions['voting.restricted.canVote']

  if (!shouldRender) return
  return (
    <div className='w-full flex justify-center absolute top-2 left-0'>
      <div className='relative py-1 px-2 bg-info/20 w-fit rounded-md flex items-center'>
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
            </div>
          }
        >
          <div className='text-xl font-mono text-center select-none z-10 flex items-center gap-2'>
            {showVoting && canVote && <VotesRemaining />}
            {settings.timer.enabled && <TimeRemaining />}
            {settings.music.enabled && <MusicStatus />}
          </div>
        </Popover>
      </div>
    </div>
  )
}
