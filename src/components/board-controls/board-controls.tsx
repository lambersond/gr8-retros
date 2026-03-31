'use client'

import { Popover } from '../common'
import { BoardControlItem } from './board-control-item'
import { MusicStatus, TimeRemaining, VotesRemaining } from './indicators'
import { AudioRefs, MusicControls, VolumeControl } from './music'
import { TimerInputs } from './timer'
import { Voting } from './voting'
import {
  useBoardPermissions,
  useBoardSettings,
} from '@/providers/retro-board/board-settings'

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
  const { userPermissions } = useBoardPermissions()
  const { settings } = useBoardSettings()
  const shouldRender =
    settings.timer.enabled || settings.music.enabled || settings.voting.enabled
  const showPopover =
    settings.music.enabled ||
    (settings.timer.enabled && userPermissions['timer.restricted.canControl'])
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
              {settings.voting.enabled && (
                <BoardControlItem>
                  <Voting />
                </BoardControlItem>
              )}
            </div>
          }
        >
          <div className='text-xl font-mono text-center select-none z-10 flex items-center gap-2'>
            {settings.voting.enabled && canVote && <VotesRemaining />}
            {settings.timer.enabled && <TimeRemaining />}
            {settings.music.enabled && <MusicStatus />}
          </div>
        </Popover>
      </div>
    </div>
  )
}
