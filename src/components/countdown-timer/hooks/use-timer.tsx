import { useChannel } from 'ably/react'
import { useCountdownTimer } from '@/hooks/use-countdown-timer'

export function useTimer(channelId: string) {
  const { formatted, isRunning, reset, start, pause, setSeconds, secondsLeft } =
    useCountdownTimer({
      initialSeconds: 300,
      autoStart: false,
    })

  const { publish } = useChannel(channelId, message => {
    const { action, value } = message.data as {
      action: 'start' | 'pause' | 'reset' | 'setDuration'
      value?: number
    }

    switch (action) {
      case 'start': {
        start()
        break
      }
      case 'pause': {
        pause()
        break
      }
      case 'reset': {
        reset()
        break
      }
      default: {
        if (action === 'setDuration' && typeof value === 'number') {
          setSeconds(value)
        }
      }
    }
  })

  const applyNewDuration = (value: number) => {
    if (!Number.isNaN(value) && value >= 0) {
      publish({ data: { action: 'setDuration', value } })
    }
  }

  const addOneMinute = () => {
    applyNewDuration(secondsLeft + 60)
  }

  const handleStart = () => {
    publish({ data: { action: 'start' } })
  }

  const handlePause = () => {
    publish({ data: { action: 'pause' } })
  }

  const handleReset = () => {
    publish({ data: { action: 'reset' } })
  }

  const togglePlay = () => {
    if (isRunning) {
      handlePause()
    } else {
      handleStart()
    }
  }

  return {
    formatted,
    isRunning,
    togglePlay,
    reset: handleReset,
    setSeconds: applyNewDuration,
    secondsLeft,
    addOneMinute,
  }
}
