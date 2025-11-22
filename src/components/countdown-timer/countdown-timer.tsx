'use client'

import React, { useState } from 'react'
import { useCountdownTimer } from '@/hooks/use-countdown-timer'

type CountdownTimerProps = {
  initialSeconds?: number
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialSeconds = 300,
}) => {
  const [durationInput, setDurationInput] = useState(initialSeconds.toString())

  const { formatted, isRunning, start, pause, reset, setSeconds } =
    useCountdownTimer({
      initialSeconds,
      autoStart: false,
    })

  const applyNewDuration = () => {
    const value = Number(durationInput)
    if (!Number.isNaN(value) && value >= 0) {
      setSeconds(value)
    }
  }

  return (
    <div className='inline-flex flex-col gap-3 p-4 border rounded-lg border-gray-300 w-48 bg-white shadow-sm'>
      {/* Timer display */}
      <div className='text-3xl font-mono text-center select-none'>
        {formatted}
      </div>

      {/* Controls */}
      <div className='flex gap-2 justify-center'>
        {isRunning ? (
          <button
            type='button'
            onClick={pause}
            className='px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition'
          >
            Pause
          </button>
        ) : (
          <button
            type='button'
            onClick={start}
            disabled={formatted === '00:00'}
            className={`px-3 py-1 text-sm rounded transition ${
              formatted === '00:00'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            Start
          </button>
        )}

        <button
          type='button'
          onClick={() => reset()}
          className='px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition'
        >
          Reset
        </button>
      </div>

      {/* Duration input */}
      <div className='flex items-center gap-2 text-xs'>
        <input
          type='number'
          min={0}
          value={durationInput}
          onChange={e => setDurationInput(e.target.value)}
          className='w-20 px-2 py-1 border rounded text-xs focus:outline-none focus:ring focus:ring-blue-300'
        />
        <span>sec</span>

        <button
          type='button'
          onClick={applyNewDuration}
          className='px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition'
        >
          Set
        </button>
      </div>
    </div>
  )
}
