'use client'

import { Popover } from '../common'
import { BoardControlItem } from './board-control-item'
import { MusicStatus, TimeRemaining } from './indicators'
import { Audio, MusicControls, VolumeControl } from './music'
import { TimerInputs } from './timer'
import {
  useBoardPermissions,
  useBoardSettings,
} from '@/providers/retro-board/board-settings'

const getHeaderLabel = (timerEnabled: boolean, musicEnabled: boolean) => {
  if (timerEnabled && musicEnabled) return 'Timer and Music'
  if (timerEnabled) return 'Timer'
  if (musicEnabled) return 'Music'
  return ''
}

export function BoardControls() {
  const { userPermissions } = useBoardPermissions()
  const { settings } = useBoardSettings()
  const shouldRender = settings.timer.enabled || settings.music.enabled
  const showPopover =
    settings.music.enabled ||
    (settings.timer.enabled && userPermissions['timer.restricted.canControl'])

  if (!shouldRender) return

  return (
    <div className='w-full flex justify-center absolute top-2 left-0'>
      <div className='relative py-1 px-2 bg-info/20 w-fit rounded-md flex items-center'>
        {settings.music.enabled && <Audio />}
        <Popover
          asChild
          hidePopover={!showPopover}
          content={
            <div className='min-w-44 bg-page rounded-xl flex flex-col border border-tertiary mt-2 shadow'>
              <BoardControlItem>
                <p className='font-bold tracking-tight text-primary'>
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
                  <BoardControlItem className='flex gap-2 items-center border-b-0'>
                    <MusicControls />
                  </BoardControlItem>
                )}
            </div>
          }
        >
          <div className='text-xl font-mono text-center select-none z-10 flex items-center gap-2'>
            {settings.timer.enabled && <TimeRemaining />}
            {settings.music.enabled && <MusicStatus />}
          </div>
        </Popover>
      </div>
    </div>
  )
}
