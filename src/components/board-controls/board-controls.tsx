'use client'

import { Popover } from '../common'
import { BoardControlItem } from './board-control-item'
import { MusicStatus, TimeRemaining } from './indicators'
import { Audio, MusicControls, VolumeControl } from './music'
import { TimerInputs } from './timer'

export function BoardControls() {
  return (
    <div className='w-full flex justify-center absolute top-2 left-0'>
      <div className='relative py-1 px-2 bg-info/20 w-fit rounded-md flex items-center'>
        <Audio />
        <Popover
          asChild
          content={
            <div className='min-w-44 bg-page rounded-xl flex flex-col border border-tertiary mt-2 shadow'>
              <BoardControlItem>
                <p className='font-bold tracking-tight text-primary'>
                  Timer and Music
                </p>
              </BoardControlItem>
              <BoardControlItem>
                <VolumeControl />
              </BoardControlItem>
              <BoardControlItem className='flex flex-col gap-2'>
                <TimerInputs />
              </BoardControlItem>
              <BoardControlItem className='flex gap-2 items-center border-b-0'>
                <MusicControls />
              </BoardControlItem>
            </div>
          }
        >
          <div className='text-xl font-mono text-center select-none z-10 flex items-center gap-2'>
            <TimeRemaining />
            <MusicStatus />
          </div>
        </Popover>
      </div>
    </div>
  )
}
