import { useCallback, useEffect } from 'react'
import { useMusic } from './use-music'
import { useBoardControlsLiveMap } from '@/hooks/use-channel-state'
import { useCountdownTimer } from '@/hooks/use-countdown-timer'

const DEFAULT_TIMER_SECONDS = 30

function elapsedSeconds(startedAt?: number) {
  if (!startedAt) return 0
  return Math.max(0, Math.floor((Date.now() - startedAt) / 1000))
}

type MusicState = {
  isPlaying: boolean
  shouldPlay: boolean
  trackId?: string
}

export function useBoardControls(id: string) {
  const { formatted, isRunning, start, pause, setSeconds, secondsLeft } =
    useCountdownTimer({
      initialSeconds: DEFAULT_TIMER_SECONDS,
      autoStart: false,
    })

  const {
    audioRef,
    isPlaying,
    startMusic,
    pauseMusic,
    changeTrackById,
    selectedTrackOption,
  } = useMusic()

  const { boardControls, updateBoardControls } = useBoardControlsLiveMap(
    id,
    DEFAULT_TIMER_SECONDS,
  )

  const syncTimerFromBoard = useCallback(() => {
    const { timer } = boardControls
    const remaining = timer.remaining ?? DEFAULT_TIMER_SECONDS
    const diff = elapsedSeconds(timer.startedAt)

    if (timer.isPlaying) start()
    else pause()

    setSeconds(Math.max(0, remaining - diff))
  }, [boardControls, pause, setSeconds, start])

  const syncMusicFromBoard = useCallback(() => {
    const music = boardControls.music

    const boardWantsMusic = !!music.isPlaying && !!music.shouldPlay
    const localIsPlaying = isPlaying

    const desiredTrackId = music.trackId ?? selectedTrackOption.id
    const localTrackId = selectedTrackOption.id

    const needsTrackChange = desiredTrackId !== localTrackId

    // If the board wants music, ensure correct track and play.
    if (boardWantsMusic) {
      if (needsTrackChange) changeTrackById(desiredTrackId, { autoplay: true })
      if (!localIsPlaying) startMusic({ force: true })
      return
    }

    // Otherwise ensure paused locally.
    if (localIsPlaying) pauseMusic()
  }, [
    boardControls.music,
    changeTrackById,
    isPlaying,
    pauseMusic,
    selectedTrackOption.id,
    startMusic,
  ])

  useEffect(() => {
    syncTimerFromBoard()
    syncMusicFromBoard()
  }, [syncTimerFromBoard, syncMusicFromBoard])

  const setTimerState = useCallback(
    (patch: Partial<typeof boardControls.timer>) => {
      updateBoardControls({
        timer: {
          ...boardControls.timer,
          ...patch,
        },
      })
    },
    [boardControls.timer, updateBoardControls],
  )

  const setMusicState = useCallback(
    (patch: Partial<MusicState>) => {
      updateBoardControls({
        music: {
          ...boardControls.music,
          ...patch,
        },
      })
    },
    [boardControls.music, updateBoardControls],
  )

  const togglePlay = useCallback(() => {
    if (isRunning) {
      pause()
      updateBoardControls({
        timer: {
          isCompleted: false,
          isPlaying: false,
          remaining: secondsLeft,
          startedAt: undefined,
        },
        music: {
          ...boardControls.music,
          shouldPlay: false,
        },
      })
      return
    }

    start()
    updateBoardControls({
      timer: {
        isCompleted: false,
        isPlaying: true,
        remaining: secondsLeft,
        startedAt: Date.now(),
      },
      music: {
        ...boardControls.music,
        shouldPlay: true,
      },
    })
  }, [
    boardControls.music,
    isRunning,
    pause,
    secondsLeft,
    start,
    updateBoardControls,
  ])

  const reset = useCallback(() => {
    updateBoardControls({
      timer: {
        isCompleted: false,
        isPlaying: false,
        remaining: DEFAULT_TIMER_SECONDS,
        startedAt: undefined,
      },
      music: {
        ...boardControls.music,
        shouldPlay: false,
        isPlaying: false,
      },
    })
  }, [boardControls.music, updateBoardControls])

  const addOneMinute = useCallback(() => {
    setTimerState({ remaining: secondsLeft + 60 })
  }, [secondsLeft, setTimerState])

  const toggleMusic = useCallback(() => {
    if (isPlaying) {
      setMusicState({
        isPlaying: false,
        shouldPlay: false,
        trackId: undefined,
      })
    } else {
      setMusicState({
        isPlaying: true,
        shouldPlay: true,
        trackId: selectedTrackOption.id,
      })
    }
  }, [isPlaying, selectedTrackOption.id, setMusicState])

  const changeTrack = useCallback(
    (option: typeof selectedTrackOption) => {
      setMusicState({
        trackId: option.id,
      })
    },
    [setMusicState],
  )

  return {
    addOneMinute,
    audioRef,
    boardControls,
    changeTrack,
    formatted,
    isRunning,
    play: isPlaying,
    reset,
    secondsLeft,
    selectedTrackOption,
    setSeconds,
    toggleMusic,
    togglePlay,
    updateBoardControls,
  }
}
