import { Square } from 'lucide-react'
import { IconButton, TimeInput } from '../../common'
import { TimerAddMinuteButton, TimerPlayButton } from '.'
import {
  useBoardControlsActions,
  useBoardControlsState,
} from '@/providers/retro-board/controls'

export function TimerInputs() {
  const { secondsLeft, isRunning } = useBoardControlsState(s => ({
    secondsLeft: s.secondsLeft,
    isRunning: s.isRunning,
  }))

  const { setSeconds, addOneMinute, reset, togglePlay } =
    useBoardControlsActions(s => ({
      setSeconds: s.setSeconds,
      addOneMinute: s.addOneMinute,
      reset: s.reset,
      togglePlay: s.togglePlay,
    }))

  return (
    <>
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
          <TimerPlayButton isRunning={isRunning} onClick={togglePlay} />
        </div>
      </div>
    </>
  )
}
