'use client'

import { Square, Volume } from 'lucide-react'
import { Dropdown, IconButton, Popover, TimeInput } from '../common'
import { MusicIcon } from '../common/icons'
import { CountdownItem } from './countdown-item'
import { useBoardControls } from './hooks/use-board-controls'
import { MusicPlayButton } from './music'
import { VolumeSlider } from './music/volume-slider'
import { TimerAddMinuteButton, TimerPlayButton } from './timer'
import { MUSIC_OPTIONS } from '@/constants'
import type { CountdownProps } from './type'

export function Countdown({ id }: Readonly<CountdownProps>) {
  const {
    addOneMinute,
    audioRef,
    changeTrack,
    formatted,
    isRunning,
    play,
    reset,
    secondsLeft,
    selectedTrackOption,
    setSeconds,
    toggleMusic,
    togglePlay,
  } = useBoardControls(id)

  return (
    <div className='w-full flex justify-center absolute top-2 left-0'>
      <div className='relative py-1 px-2 bg-info/20 w-fit rounded-md flex items-center'>
        <audio className='hidden' loop ref={audioRef}>
          <track kind='captions' srcLang='en' label='Track Name' />
        </audio>
        <Popover
          asChild
          content={
            <div className='min-w-44 bg-page rounded-xl flex flex-col border border-tertiary mt-2 shadow'>
              <CountdownItem>
                <p className='font-bold tracking-tight text-primary'>
                  Timer and Music
                </p>
              </CountdownItem>
              <CountdownItem>
                <VolumeSlider audioRef={audioRef} />
              </CountdownItem>
              <CountdownItem className='flex flex-col gap-2'>
                <TimeInput value={secondsLeft} onChange={setSeconds} />
                <div className='flex justify-between items-center'>
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
              </CountdownItem>
              <CountdownItem className='flex gap-2 items-center border-b-0'>
                <Dropdown
                  width='w-44'
                  options={MUSIC_OPTIONS}
                  selected={selectedTrackOption}
                  onSelect={changeTrack}
                />
                <MusicPlayButton play={play} toggleMusic={toggleMusic} />
              </CountdownItem>
            </div>
          }
        >
          <div className='text-xl font-mono text-center select-none z-10 flex items-center gap-2'>
            {formatted}
            <div className='flex items-center'>
              <Volume className='flex-1 min-w-5 min-h-5 -mr-1.5' />
              <MusicIcon
                height='sm'
                intent='primary'
                bars={5}
                isPlaying={play}
              />
            </div>
          </div>
        </Popover>
      </div>
    </div>
  )
}
