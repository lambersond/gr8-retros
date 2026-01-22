import {
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react'
import { useBoardSettings } from '../board-settings'
import {
  RetroBoardControlsActionsStoreContext,
  RetroBoardControlsStateStoreContext,
} from './context'
import { createStore } from './store'
import { elapsedSeconds } from './utils'
import { useBoardControlsLiveMap } from '@/hooks/use-channel-state'
import { useCountdownTimer } from '@/hooks/use-countdown-timer'
import { useMusic } from '@/hooks/use-music'
import type {
  RetroBoardControls,
  RetroBoardControlsActions,
  RetroBoardControlsState,
} from './types'
import type { DropdownOption } from '@/components/common'

type MusicState = {
  isPlaying: boolean
  shouldPlay: boolean
  trackId?: string
}

const TICKING_TRIGGER_AT = 9 // seconds remaining when ticking starts

export function RetroBoardControlsProvider({
  boardId,
  children,
}: Readonly<{
  boardId: string
  children: ReactNode
}>) {
  const {
    settings: {
      timer: {
        subsettings: {
          defaultDuration: { value: defaultDuration },
        },
      },
    },
  } = useBoardSettings()
  const { formatted, isRunning, start, pause, setSeconds, secondsLeft } =
    useCountdownTimer({
      initialSeconds: defaultDuration,
      autoStart: false,
    })

  const {
    musicRef,
    dingRef,
    tickingRef,
    isPlaying,
    startMusic,
    pauseMusic,
    changeTrackById,
    selectedTrackOption,
    startTicking,
    stopTicking,
    playDing,
  } = useMusic()

  const { boardControls, updateBoardControls } = useBoardControlsLiveMap(
    boardId,
    defaultDuration,
  )

  // Track ticking/ding state to avoid re-triggering
  const isTickingRef = useRef(false)
  const dingPlayedRef = useRef(false)

  const syncTimerFromBoard = useCallback(() => {
    const { timer } = boardControls
    const remaining = timer.remaining ?? defaultDuration
    const diff = elapsedSeconds(timer.startedAt)

    if (timer.isPlaying) start()
    else pause()

    const newSeconds = Math.max(0, remaining - diff)
    if (newSeconds > 0) setSeconds(newSeconds)
    else {
      setSeconds(0)
      reset()
    }
  }, [boardControls, defaultDuration, pause, setSeconds, start])

  const syncMusicFromBoard = useCallback(() => {
    const music = boardControls.music

    const boardWantsMusic = !!music.isPlaying && !!music.shouldPlay
    const localIsPlaying = isPlaying

    const desiredTrackId = music.trackId ?? selectedTrackOption.id
    const localTrackId = selectedTrackOption.id

    const needsTrackChange = desiredTrackId !== localTrackId

    if (boardWantsMusic) {
      if (needsTrackChange) changeTrackById(desiredTrackId, { autoplay: true })
      if (!localIsPlaying) startMusic({ force: true })
      return
    }

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

  // --- Ticking and Ding sound effects ---
  useEffect(() => {
    // Determine if we should be ticking
    const shouldTick =
      isRunning && secondsLeft <= TICKING_TRIGGER_AT && secondsLeft > 0

    // Start ticking when entering the trigger zone
    if (shouldTick && !isTickingRef.current) {
      startTicking(secondsLeft)
      isTickingRef.current = true
    }

    // Stop ticking when leaving the trigger zone (time added, paused, or completed)
    if (!shouldTick && isTickingRef.current) {
      stopTicking()
      isTickingRef.current = false
    }

    // Play ding when timer completes (less than 1 second remaining)
    if (isRunning && secondsLeft < 1.1 && !dingPlayedRef.current) {
      stopTicking()
      isTickingRef.current = false
      setTimeout(() => {
        playDing()
      }, 500)
      dingPlayedRef.current = true
    }

    // Reset ding flag when timer is reset or has plenty of time
    if (!isRunning || secondsLeft >= TICKING_TRIGGER_AT) {
      dingPlayedRef.current = false
    }
  }, [isRunning, secondsLeft, startTicking, stopTicking, playDing])

  // Cleanup ticking on unmount
  useEffect(() => {
    return () => {
      stopTicking()
    }
  }, [stopTicking])

  const setTimerState = useCallback(
    (patch: Partial<RetroBoardControls['timer']>) => {
      updateBoardControls({ timer: { ...boardControls.timer, ...patch } })
    },
    [boardControls.timer, updateBoardControls],
  )

  const setMusicState = useCallback(
    (patch: Partial<MusicState>) => {
      updateBoardControls({ music: { ...boardControls.music, ...patch } })
    },
    [boardControls.music, updateBoardControls],
  )

  // ------- Actions -------
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
        music: { ...boardControls.music, shouldPlay: false },
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
      music: { ...boardControls.music, shouldPlay: true },
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
    // Reset sound state
    stopTicking()
    isTickingRef.current = false
    dingPlayedRef.current = false

    updateBoardControls({
      timer: {
        isCompleted: false,
        isPlaying: false,
        remaining: defaultDuration,
        startedAt: undefined,
      },
      music: {
        ...boardControls.music,
        shouldPlay: false,
        isPlaying: false,
      },
    })
  }, [boardControls.music, defaultDuration, stopTicking, updateBoardControls])

  const addOneMinute = useCallback(() => {
    setTimerState({ remaining: secondsLeft + 60 })
  }, [secondsLeft, setTimerState])

  const toggleMusic = useCallback(() => {
    if (isPlaying) {
      setMusicState({ isPlaying: false, shouldPlay: false, trackId: undefined })
    } else {
      setMusicState({
        isPlaying: true,
        shouldPlay: true,
        trackId: selectedTrackOption.id,
      })
    }
  }, [isPlaying, selectedTrackOption.id, setMusicState])

  const changeTrack = useCallback(
    (option: DropdownOption) => {
      setMusicState({ trackId: option.id })
    },
    [setMusicState],
  )

  const handleManualSecondsChange = useCallback(
    (newSeconds: number) => {
      setSeconds(newSeconds)
      setTimerState({
        remaining: newSeconds,
        startedAt: isRunning ? Date.now() : undefined,
      })
    },
    [isRunning, setSeconds, setTimerState],
  )

  // ------- Stores -------
  const stateStoreRef = useRef(
    createStore<RetroBoardControlsState>({
      boardControls,
      formatted,
      isRunning,
      secondsLeft,
      play: isPlaying,
      musicRef,
      tickingRef,
      dingRef,
      selectedTrackOption,
    }),
  )

  const actionsStoreRef = useRef(
    createStore<RetroBoardControlsActions>({
      togglePlay,
      reset,
      addOneMinute,
      setSeconds: handleManualSecondsChange,
      toggleMusic,
      changeTrack,
      updateBoardControls,
    }),
  )

  useLayoutEffect(() => {
    stateStoreRef.current.setState({
      boardControls,
      formatted,
      isRunning,
      secondsLeft,
      play: isPlaying,
      musicRef,
      tickingRef,
      dingRef,
      selectedTrackOption,
    })
  }, [
    boardControls,
    formatted,
    isRunning,
    secondsLeft,
    isPlaying,
    musicRef,
    tickingRef,
    dingRef,
    selectedTrackOption,
  ])

  useLayoutEffect(() => {
    actionsStoreRef.current.setState({
      togglePlay,
      reset,
      addOneMinute,
      setSeconds: handleManualSecondsChange,
      toggleMusic,
      changeTrack,
      updateBoardControls,
    })
  }, [
    togglePlay,
    reset,
    addOneMinute,
    handleManualSecondsChange,
    toggleMusic,
    changeTrack,
    updateBoardControls,
  ])

  return (
    <RetroBoardControlsStateStoreContext.Provider value={stateStoreRef.current}>
      <RetroBoardControlsActionsStoreContext.Provider
        value={actionsStoreRef.current}
      >
        {children}
      </RetroBoardControlsActionsStoreContext.Provider>
    </RetroBoardControlsStateStoreContext.Provider>
  )
}
