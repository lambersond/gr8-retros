'use client'

import { Pause, Play, Square } from 'lucide-react'
import { IconButton, Popover, TimeInput } from '../common'
import { useCountdown } from './use-countdown'
import type { CountdownProps } from './type'

export function Countdown({ id }: Readonly<CountdownProps>) {
  const {
    addOneMinute,
    formatted,
    isRunning,
    pause,
    reset,
    secondsLeft,
    setSeconds,
    start,
  } = useCountdown(id)

  return (
    <div className='w-full flex justify-center absolute top-2 left-0'>
      <div className='relative py-1 px-2 bg-info/20 w-fit rounded-md flex items-center'>
        <Popover
          asChild
          content={
            <div className='min-w-44 p-4 bg-page rounded-xl flex flex-col gap-4 border border-tertiary mt-2 shadow'>
              <TimeInput value={secondsLeft} onChange={setSeconds} />
              <div className='flex justify-between'>
                <button
                  className='border border-tertiary rounded py-1 px-4 w-fit text-sm hover:bg-info/10 cursor-pointer transition hover:border-info'
                  onClick={addOneMinute}
                >
                  + 1 min
                </button>
                <div className='flex gap-2'>
                  {isRunning ? (
                    <>
                      <IconButton
                        icon={Square}
                        tooltip='Reset Timer'
                        onClick={reset}
                        size='lg'
                        intent='info'
                      />
                      <IconButton
                        icon={Pause}
                        tooltip='Pause Timer'
                        onClick={pause}
                        size='lg'
                        intent='primary'
                      />
                    </>
                  ) : (
                    <IconButton
                      icon={Play}
                      tooltip='Start Timer'
                      onClick={start}
                      size='lg'
                      intent='info'
                    />
                  )}
                </div>
              </div>
            </div>
          }
        >
          <div className='text-xl font-mono text-center select-none z-10'>
            {formatted}
          </div>
        </Popover>
      </div>
    </div>
  )
}
