'use client'

import { Square } from 'lucide-react'
import { Dropdown, IconButton, Popover, TimeInput } from '../common'
import { MusicIcon } from '../common/icons'
import { MusicPlayButton } from './music'
import { TimerAddMinuteButton, TimerPlayButton } from './timer'
import { useMusic } from './use-music'
import { useTimer } from './use-timer'
import { MUSIC_OPTIONS } from '@/constants'
import type { CountdownProps } from './type'

export function Countdown({ id }: Readonly<CountdownProps>) {
  const {
    addOneMinute,
    formatted,
    isRunning,
    reset,
    secondsLeft,
    setSeconds,
    togglePlay,
  } = useTimer(id)
  const { audioRef, play, toggleMusic, changeTrack, selectedTrackOption } =
    useMusic()

  return (
    <div className='w-full flex justify-center absolute top-2 left-0'>
      <div className='relative py-1 px-2 bg-info/20 w-fit rounded-md flex items-center'>
        <audio className='hidden' loop ref={audioRef}>
          <track kind='captions' srcLang='en' label='Track Name' />
        </audio>
        <Popover
          asChild
          content={
            <div className='min-w-44 p-4 bg-page rounded-xl flex flex-col gap-4 border border-tertiary mt-2 shadow'>
              <p className='text-xl text-primary'>Timer and Music</p>
              <span className='border-b-0.5 border-tertiary border' />
              <TimeInput value={secondsLeft} onChange={setSeconds} />
              <div className='flex flex-col'>
                <div className='flex justify-between'>
                  <TimerAddMinuteButton onClick={addOneMinute} />
                  <div className='flex gap-2'>
                    {isRunning && (
                      <IconButton
                        icon={Square}
                        tooltip='Reset Timer'
                        onClick={reset}
                        size='lg'
                        intent='info'
                      />
                    )}
                    <TimerPlayButton
                      isRunning={isRunning}
                      onClick={togglePlay}
                    />
                  </div>
                </div>
                <span className='border-b-0.5 my-4 border-tertiary border' />
                <div className='flex gap-2 items-center'>
                  <Dropdown
                    width='w-44'
                    options={MUSIC_OPTIONS}
                    selected={selectedTrackOption}
                    onSelect={changeTrack}
                  />
                  <MusicPlayButton play={play} toggleMusic={toggleMusic} />
                </div>
              </div>
            </div>
          }
        >
          <div className='text-xl font-mono text-center select-none z-10 flex items-center gap-2'>
            {formatted}
            {play && <MusicIcon height='sm' intent='primary' bars={5} />}
          </div>
        </Popover>
      </div>
    </div>
  )
}
