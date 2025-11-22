'use client'

import { useEffect, useState } from 'react'

type UseCountdownTimerOptions = {
  initialSeconds?: number
  autoStart?: boolean
  onComplete?: () => void
}

export function useCountdownTimer({
  initialSeconds = 300,
  autoStart = false,
  onComplete,
}: UseCountdownTimerOptions = {}) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(autoStart)

  useEffect(() => {
    setSecondsLeft(initialSeconds)
    setIsRunning(autoStart)
  }, [initialSeconds, autoStart])

  useEffect(() => {
    if (!isRunning) return

    const id = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(id)
          setIsRunning(false)
          onComplete?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(id)
  }, [isRunning, onComplete])

  const start = () => {
    if (secondsLeft > 0) {
      setIsRunning(true)
    }
  }

  const pause = () => {
    setIsRunning(false)
  }

  const reset = (newSeconds?: number) => {
    setIsRunning(false)
    setSecondsLeft(newSeconds ?? initialSeconds)
  }

  const setSeconds = (newSeconds: number) => {
    setIsRunning(false)
    setSecondsLeft(newSeconds)
  }

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const formatted = `${String(minutes).padStart(2, '0')}:${String(
    seconds,
  ).padStart(2, '0')}`

  return {
    secondsLeft,
    isRunning,
    formatted,
    start,
    pause,
    reset,
    setSeconds,
  }
}
