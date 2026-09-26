import {
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { useBoardSettings } from '../board-settings'
import {
  RetroBoardControlsActionsStoreContext,
  RetroBoardControlsStateStoreContext,
} from './context'
import { createStore } from './store'
import { elapsedSeconds } from './utils'
import { GuidedPhase, VotingMode, VotingState } from '@/enums'
import { useAuth } from '@/hooks/use-auth'
import { useBoardControlsLiveMap } from '@/hooks/use-channel-state'
import { useCountdownTimer } from '@/hooks/use-countdown-timer'
import { useMusic } from '@/hooks/use-music'
import { useVoting } from '@/hooks/use-voting'
import type {
  RetroBoardControls,
  RetroBoardControlsActions,
  RetroBoardControlsState,
} from './types'
import type { DropdownOption } from '@/components/common'

const TICKING_TRIGGER_AT = 10 // seconds remaining when ticking starts

export function RetroBoardControlsProvider({
  boardId,
  children,
}: Readonly<{
  boardId: string
  children: ReactNode
}>) {
  const {
    user: { id: userId },
  } = useAuth()

  const [hasLoaded, setHasLoaded] = useState(false)
  const hasVotedRef = useRef(false)
  const onlyOnLoadRef = useRef(true)
  // ---------------------------------------------------------------------------
  // Board settings (defaults)
  // ---------------------------------------------------------------------------
  const {
    settings: {
      timer: {
        subsettings: {
          defaultDuration: { value: defaultDuration },
        },
      },
      voting: {
        subsettings: {
          votingMode: { choice: defaultVotingMode },
          limit: { value: defaultVotingLimit },
        },
      },
    },
  } = useBoardSettings()

  // ---------------------------------------------------------------------------
  // Core hooks
  // ---------------------------------------------------------------------------
  const { formatted, isRunning, start, pause, setSeconds, secondsLeft } =
    useCountdownTimer({ initialSeconds: defaultDuration, autoStart: false })

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

  const { boardControls, updateBoardControls } = useBoardControlsLiveMap({
    channelName: boardId,
    defaultTimerDuration: defaultDuration,
    defaultVotingMode,
    defaultVotingLimit,
    onLoad: initialControls => {
      const hasVoted = Object.hasOwn(
        initialControls.voting.collectedVotes,
        userId,
      )
      hasVotedRef.current = hasVoted
      setHasLoaded(true)
    },
  })

  const handleVoteSubmit = useCallback(
    async (localVotes: string[]) => {
      updateBoardControls({
        voting: {
          ...boardControls.voting,
          collectedVotes: {
            ...boardControls.voting.collectedVotes,
            [userId]: localVotes,
          },
        },
      })
    },
    [boardControls.voting, userId, updateBoardControls],
  )

  const {
    votes,
    hasVoted,
    canVote,
    addMyVote,
    removeMyVote,
    clearMyVotes,
    updateHasVoted,
    submitVotes,
  } = useVoting({
    state: boardControls.voting.state,
    mode: boardControls.voting.mode,
    limit: boardControls.voting.limit,
    onSubmit: handleVoteSubmit,
  })

  // ---------------------------------------------------------------------------
  // Handle initial load + board updates
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (hasLoaded && onlyOnLoadRef.current) {
      onlyOnLoadRef.current = false
    } else {
      return
    }
    updateHasVoted(hasVotedRef.current)
  }, [hasLoaded])

  // ---------------------------------------------------------------------------
  // Sync board-settings defaults → LiveMap
  // ---------------------------------------------------------------------------
  const boardVotingRef = useRef(boardControls.voting)
  boardVotingRef.current = boardControls.voting

  const prevDefaultsRef = useRef({
    mode: defaultVotingMode,
    limit: defaultVotingLimit,
  })
  const prevVotingStateRef = useRef(boardControls.voting.state)

  useEffect(() => {
    const votingState = boardControls.voting.state
    if (votingState === VotingState.OPEN) {
      prevVotingStateRef.current = votingState
      return
    }

    const defaultsChanged =
      prevDefaultsRef.current.mode !== defaultVotingMode ||
      prevDefaultsRef.current.limit !== defaultVotingLimit

    const returnedToIdle =
      prevVotingStateRef.current !== votingState &&
      (votingState === VotingState.IDLE || votingState === VotingState.CLOSED)

    prevDefaultsRef.current = {
      mode: defaultVotingMode,
      limit: defaultVotingLimit,
    }
    prevVotingStateRef.current = votingState

    if (defaultsChanged || returnedToIdle) {
      updateBoardControls({
        voting: {
          ...boardVotingRef.current,
          mode: defaultVotingMode,
          limit: defaultVotingLimit,
        },
      })
    }
  }, [
    boardControls.voting.state,
    defaultVotingMode,
    defaultVotingLimit,
    updateBoardControls,
  ])

  // ---------------------------------------------------------------------------
  // Ticking / ding refs
  // ---------------------------------------------------------------------------
  const isTickingRef = useRef(false)
  const dingPlayedRef = useRef(false)

  // ---------------------------------------------------------------------------
  // Board → local sync
  // ---------------------------------------------------------------------------
  const resetTimerLocally = useCallback(() => {
    stopTicking()
    isTickingRef.current = false
    dingPlayedRef.current = false
  }, [stopTicking])

  const syncTimerFromBoard = useCallback(() => {
    const { timer } = boardControls
    const remaining = timer.remaining ?? defaultDuration
    const diff = elapsedSeconds(timer.startedAt)

    if (timer.isPlaying) start()
    else pause()

    const newSeconds = Math.max(0, remaining - diff)
    if (newSeconds > 0) {
      setSeconds(newSeconds)
    } else {
      setSeconds(0)
      resetTimerLocally()
    }
  }, [
    boardControls,
    defaultDuration,
    pause,
    resetTimerLocally,
    setSeconds,
    start,
  ])

  const syncMusicFromBoard = useCallback(() => {
    const { music } = boardControls
    const boardWantsMusic = music.isPlaying && music.shouldPlay

    const desiredTrackId = music.trackId ?? selectedTrackOption.id
    const needsTrackChange = desiredTrackId !== selectedTrackOption.id

    if (boardWantsMusic) {
      if (needsTrackChange) changeTrackById(desiredTrackId, { autoplay: true })
      if (!isPlaying) startMusic({ force: true })
      return
    }

    if (isPlaying) pauseMusic()
  }, [
    boardControls,
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

  // Reset board state when the local countdown reaches 0.
  const completedRef = useRef(false)

  useEffect(() => {
    const isComplete = secondsLeft === 0 && !isRunning

    if (isComplete && !completedRef.current) {
      completedRef.current = true
      resetTimerLocally()
      updateBoardControls({
        timer: {
          isCompleted: true,
          isPlaying: false,
          remaining: defaultDuration,
          startedAt: undefined,
        },
        music: { ...boardControls.music, shouldPlay: false, isPlaying: false },
      })
    }

    if (!isComplete) {
      completedRef.current = false
    }
  }, [
    secondsLeft,
    isRunning,
    defaultDuration,
    boardControls.music,
    resetTimerLocally,
    updateBoardControls,
  ])

  // ---------------------------------------------------------------------------
  // Ticking / ding effects
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const shouldTick =
      isRunning && secondsLeft <= TICKING_TRIGGER_AT && secondsLeft > 0

    if (shouldTick && !isTickingRef.current) {
      startTicking(secondsLeft)
      isTickingRef.current = true
    }

    if (!shouldTick && isTickingRef.current) {
      stopTicking()
      isTickingRef.current = false
    }

    if (isRunning && secondsLeft < 1.1 && !dingPlayedRef.current) {
      stopTicking()
      isTickingRef.current = false
      setTimeout(playDing, 500)
      dingPlayedRef.current = true
    }

    if (!isRunning || secondsLeft >= TICKING_TRIGGER_AT) {
      dingPlayedRef.current = false
    }
  }, [isRunning, secondsLeft, startTicking, stopTicking, playDing])

  useEffect(() => stopTicking, [stopTicking])

  // ---------------------------------------------------------------------------
  // Board control helpers
  // ---------------------------------------------------------------------------
  const patchTimer = useCallback(
    (patch: Partial<RetroBoardControls['timer']>) => {
      updateBoardControls({ timer: { ...boardControls.timer, ...patch } })
    },
    [boardControls.timer, updateBoardControls],
  )

  const patchMusic = useCallback(
    (patch: Partial<RetroBoardControls['music']>) => {
      updateBoardControls({ music: { ...boardControls.music, ...patch } })
    },
    [boardControls.music, updateBoardControls],
  )

  const patchVoting = useCallback(
    (patch: Partial<RetroBoardControls['voting']>) => {
      updateBoardControls({ voting: { ...boardControls.voting, ...patch } })
    },
    [boardControls.voting, updateBoardControls],
  )

  // ---------------------------------------------------------------------------
  // Timer actions
  // ---------------------------------------------------------------------------
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
    resetTimerLocally()
    updateBoardControls({
      timer: {
        isCompleted: false,
        isPlaying: false,
        remaining: defaultDuration,
        startedAt: undefined,
      },
      music: { ...boardControls.music, shouldPlay: false, isPlaying: false },
    })
  }, [
    boardControls.music,
    defaultDuration,
    resetTimerLocally,
    updateBoardControls,
  ])

  const addOneMinute = useCallback(() => {
    const newSeconds = secondsLeft + 60
    setSeconds(newSeconds)
    patchTimer({
      remaining: newSeconds,
      startedAt: isRunning ? Date.now() : undefined,
    })
  }, [isRunning, secondsLeft, setSeconds, patchTimer])

  // ---------------------------------------------------------------------------
  // Music actions
  // ---------------------------------------------------------------------------
  const toggleMusic = useCallback(() => {
    if (isPlaying) {
      patchMusic({ isPlaying: false, shouldPlay: false, trackId: undefined })
    } else {
      patchMusic({
        isPlaying: true,
        shouldPlay: true,
        trackId: selectedTrackOption.id,
      })
    }
  }, [isPlaying, selectedTrackOption.id, patchMusic])

  const changeTrack = useCallback(
    (option: DropdownOption) => patchMusic({ trackId: option.id }),
    [patchMusic],
  )

  const handleManualSecondsChange = useCallback(
    (newSeconds: number) => {
      setSeconds(newSeconds)
      patchTimer({
        remaining: newSeconds,
        startedAt: isRunning ? Date.now() : undefined,
      })
    },
    [isRunning, setSeconds, patchTimer],
  )

  // ---------------------------------------------------------------------------
  // Voting actions
  // ---------------------------------------------------------------------------
  const openVoting = useCallback(() => {
    patchVoting({ state: VotingState.OPEN })
  }, [patchVoting])

  const closeVoting = useCallback(() => {
    const results = {} as Record<string, string[]>

    for (const [userId, userVotes] of Object.entries(
      boardControls.voting.collectedVotes,
    )) {
      for (const vote of userVotes) {
        if (!results[vote]) {
          results[vote] = []
        }
        results[vote].push(userId)
      }
    }
    patchVoting({ state: VotingState.CLOSED, results })
  }, [patchVoting])

  const resetVoting = useCallback(() => {
    clearMyVotes()
    patchVoting({ state: VotingState.IDLE, results: {}, collectedVotes: {} })
  }, [clearMyVotes, patchVoting])

  const undoVoteSubmission = useCallback(() => {
    if (boardControls.voting.state !== VotingState.OPEN) return
    const { [userId]: _omit, ...remaining } =
      boardControls.voting.collectedVotes
    patchVoting({ collectedVotes: remaining })
    clearMyVotes()
  }, [
    boardControls.voting.state,
    boardControls.voting.collectedVotes,
    userId,
    patchVoting,
    clearMyVotes,
  ])

  // Adjustable even while a vote is open: the guided Vote phase opens voting
  // automatically, so the facilitator sets the allowance/mode during the open
  // vote. In the manual flow these are only surfaced while IDLE, so allowing
  // OPEN here changes nothing there. Changing the limit only moves the per-user
  // cap; already-submitted votes are untouched.
  const setVotingMode = useCallback(
    (mode: VotingMode) => {
      patchVoting({ mode })
    },
    [patchVoting],
  )

  const setVotingLimit = useCallback(
    (limit: number) => {
      patchVoting({ limit })
    },
    [patchVoting],
  )

  // ---------------------------------------------------------------------------
  // Facilitator mode actions
  // ---------------------------------------------------------------------------
  const toggleFacilitatorMode = useCallback(() => {
    const willBeActive = !boardControls.facilitatorMode.isActive
    updateBoardControls({
      facilitatorMode: {
        isActive: willBeActive,
        skippedIds: [],
      },
      // Releasing the chosen facilitator when ending a session avoids carrying
      // over a stale choice into the next retro.
      ...(willBeActive ? {} : { chosenFacilitatorId: undefined }),
    })
  }, [boardControls.facilitatorMode.isActive, updateBoardControls])

  // ---------------------------------------------------------------------------
  // Guided (Parabol-style) mode actions
  //
  // Each phase transition writes the phase's full canonical snapshot in ONE
  // updateBoardControls call. Every call is a separate Ably `set` that re-reads
  // state via compact(); chaining openVoting()/closeVoting()/toggleFacilitatorMode()
  // in a tick races on that stale read and trips the channel rate limit (see
  // handleEndFacilitation in facilitator-view.tsx). Batching keeps Next/Back
  // atomic and makes them symmetric, so entering a phase from either direction
  // just re-applies that phase's snapshot.
  // ---------------------------------------------------------------------------
  const applyGuidedPhase = useCallback(
    (phase: GuidedPhase, isActive: boolean) => {
      const base = boardControls

      if (phase === GuidedPhase.VOTE) {
        // Fresh voting session each time Vote is entered.
        updateBoardControls({
          guided: { isActive, phase },
          voting: {
            ...base.voting,
            state: VotingState.OPEN,
            results: {},
            collectedVotes: {},
          },
          facilitatorMode: { isActive: false, skippedIds: [] },
        })
      } else if (phase === GuidedPhase.DISCUSS) {
        // Tally submitted votes into results, then hand off to the facilitator
        // stack view (mirrors closeVoting + starting facilitator mode).
        const results = {} as Record<string, string[]>
        for (const [voterId, userVotes] of Object.entries(
          base.voting.collectedVotes,
        )) {
          for (const vote of userVotes) {
            if (!results[vote]) {
              results[vote] = []
            }
            results[vote].push(voterId)
          }
        }
        updateBoardControls({
          guided: { isActive, phase },
          voting: { ...base.voting, state: VotingState.CLOSED, results },
          facilitatorMode: { isActive: true, skippedIds: [] },
        })
      } else {
        // Reflect / Group: no voting, no facilitation.
        updateBoardControls({
          guided: { isActive, phase },
          voting: {
            ...base.voting,
            state: VotingState.IDLE,
            results: {},
            collectedVotes: {},
          },
          facilitatorMode: { isActive: false, skippedIds: [] },
        })
      }

      // Local votes/hasVoted are cleared by useVoting's own effect when the
      // voting state leaves OPEN. Clearing them eagerly here reset hasVoted a
      // frame before the synced state caught up, briefly flashing the "I'm
      // done" button when stepping back out of the Vote phase.
    },
    [boardControls, updateBoardControls],
  )

  const startGuidedRetro = useCallback(() => {
    applyGuidedPhase(GuidedPhase.REFLECT, true)
  }, [applyGuidedPhase])

  const setGuidedPhase = useCallback(
    (phase: GuidedPhase) => {
      applyGuidedPhase(phase, true)
    },
    [applyGuidedPhase],
  )

  const endGuidedRetro = useCallback(() => {
    updateBoardControls({
      guided: { isActive: false, phase: GuidedPhase.REFLECT },
      voting: {
        ...boardControls.voting,
        state: VotingState.IDLE,
        results: {},
        collectedVotes: {},
      },
      facilitatorMode: { isActive: false, skippedIds: [] },
      chosenFacilitatorId: undefined,
    })
  }, [boardControls.voting, updateBoardControls])

  // ---------------------------------------------------------------------------
  // Stores
  // ---------------------------------------------------------------------------
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
      votes,
      hasVoted,
      canVote,
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
      addMyVote,
      removeMyVote,
      clearMyVotes,
      submitVotes,
      undoVoteSubmission,
      openVoting,
      closeVoting,
      resetVoting,
      setVotingMode,
      setVotingLimit,
      toggleFacilitatorMode,
      startGuidedRetro,
      setGuidedPhase,
      endGuidedRetro,
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
      votes,
      hasVoted,
      canVote,
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
    votes,
    hasVoted,
    canVote,
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
      addMyVote,
      removeMyVote,
      clearMyVotes,
      submitVotes,
      undoVoteSubmission,
      openVoting,
      closeVoting,
      resetVoting,
      setVotingMode,
      setVotingLimit,
      toggleFacilitatorMode,
      startGuidedRetro,
      setGuidedPhase,
      endGuidedRetro,
    })
  }, [
    togglePlay,
    reset,
    addOneMinute,
    handleManualSecondsChange,
    toggleMusic,
    changeTrack,
    updateBoardControls,
    addMyVote,
    removeMyVote,
    clearMyVotes,
    submitVotes,
    undoVoteSubmission,
    openVoting,
    closeVoting,
    resetVoting,
    setVotingMode,
    setVotingLimit,
    toggleFacilitatorMode,
    startGuidedRetro,
    setGuidedPhase,
    endGuidedRetro,
  ])

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
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
