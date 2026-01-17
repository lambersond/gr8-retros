import {
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react'
import { DEFAULT_TIMER_SECONDS } from './constants'
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

export function RetroBoardControlsProvider({
  boardId,
  children,
  defaultTimerSeconds = DEFAULT_TIMER_SECONDS,
}: Readonly<{
  boardId: string
  children: ReactNode
  defaultTimerSeconds?: number
}>) {
  const { formatted, isRunning, start, pause, setSeconds, secondsLeft } =
    useCountdownTimer({
      initialSeconds: defaultTimerSeconds,
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
    boardId,
    defaultTimerSeconds,
  )

  const syncTimerFromBoard = useCallback(() => {
    const { timer } = boardControls
    const remaining = timer.remaining ?? defaultTimerSeconds
    const diff = elapsedSeconds(timer.startedAt)

    if (timer.isPlaying) start()
    else pause()

    const newSeconds = Math.max(0, remaining - diff)
    if (newSeconds > 0) setSeconds(newSeconds)
    else {
      setSeconds(0)
      reset()
    }
  }, [boardControls, defaultTimerSeconds, pause, setSeconds, start])

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
    updateBoardControls({
      timer: {
        isCompleted: false,
        isPlaying: false,
        remaining: defaultTimerSeconds,
        startedAt: undefined,
      },
      music: {
        ...boardControls.music,
        shouldPlay: false,
        isPlaying: false,
      },
    })
  }, [boardControls.music, defaultTimerSeconds, updateBoardControls])

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
      audioRef,
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
      audioRef,
      selectedTrackOption,
    })
  }, [
    boardControls,
    formatted,
    isRunning,
    secondsLeft,
    isPlaying,
    audioRef,
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
