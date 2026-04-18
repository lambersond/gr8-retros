import { useCallback, useEffect, useRef, useState } from 'react'
import { useAbly } from 'ably/react'
import { VotingMode, VotingState } from '@/enums'

const BOARD_CONTROLS_KEY = 'boardControlsV5'

type BoardControls = {
  timer: {
    startedAt: number | undefined
    remaining: number | undefined
    isPlaying: boolean
    isCompleted: boolean
  }
  music: {
    shouldPlay: boolean
    isPlaying: boolean
    trackId: string | undefined
  }
  voting: {
    state: VotingState
    mode: VotingMode
    limit: number
    collectedVotes: Record<string, string[]>
    results: Record<string, string[]>
  }
  facilitatorMode: {
    isActive: boolean
  }
}

const DEFAULT_BOARD_CONTROLS: BoardControls = {
  timer: {
    startedAt: undefined,
    remaining: undefined,
    isPlaying: false,
    isCompleted: false,
  },
  music: {
    shouldPlay: false,
    isPlaying: false,
    trackId: undefined,
  },
  voting: {
    state: VotingState.IDLE,
    mode: VotingMode.SINGLE,
    limit: 0,
    collectedVotes: {},
    results: {},
  },
  facilitatorMode: {
    isActive: false,
  },
}

/**
 * Minimal shape of the LiveObjects PathObject API used by this hook.
 * The full types live in ably/liveobjects but that module's .d.mts export
 * has resolution issues in some IDE TS servers, so we declare just what we need.
 */
interface PathObject {
  get(key: string): PathObject
  set(key: string, value: unknown): Promise<void>
  compact(): unknown
  subscribe(listener: (event: { object: PathObject }) => void): {
    unsubscribe(): void
  }
}

type UseBoardControlsLiveMapParams = {
  channelName: string
  defaultTimerDuration?: number
  defaultVotingMode?: VotingMode
  defaultVotingLimit?: number
  onLoad?: (initialBoardControls: BoardControls) => void
}

export function useBoardControlsLiveMap({
  channelName,
  defaultTimerDuration = 300,
  defaultVotingMode = VotingMode.MULTI,
  defaultVotingLimit = 3,
  onLoad,
}: UseBoardControlsLiveMapParams) {
  const [root, setRoot] = useState<PathObject>()
  const [boardControls, setBoardControls] = useState<BoardControls>(
    DEFAULT_BOARD_CONTROLS,
  )
  const [error, setError] = useState<Error>()
  const ably = useAbly()
  const isSetup = useRef(false)

  useEffect(() => {
    const channel = ably.channels.get(channelName)
    async function setup() {
      try {
        // channel.object is added at runtime by the LiveObjects plugin
        const rootObj = await (
          channel as unknown as { object: { get(): Promise<PathObject> } }
        ).object.get()

        // Check if the controls already exist
        const existing = rootObj.get(BOARD_CONTROLS_KEY).compact() as
          | BoardControls
          | undefined

        // If it doesn't exist yet, initialize it
        if (!existing) {
          await rootObj.set(BOARD_CONTROLS_KEY, {
            timer: {
              startedAt: undefined,
              remaining: defaultTimerDuration,
              isPlaying: false,
              isCompleted: false,
            },
            music: {
              shouldPlay: false,
              isPlaying: false,
              trackId: undefined,
            },
            voting: {
              state: VotingState.IDLE,
              mode: defaultVotingMode,
              limit: defaultVotingLimit,
              collectedVotes: {},
              results: {},
            },
            facilitatorMode: {
              isActive: false,
            },
          })
        }

        rootObj.get(BOARD_CONTROLS_KEY).subscribe(({ object }) => {
          const value = object.compact() as BoardControls | undefined
          setBoardControls(value ?? DEFAULT_BOARD_CONTROLS)
        })

        setRoot(rootObj)

        const initialBoardControls =
          (rootObj.get(BOARD_CONTROLS_KEY).compact() as
            | BoardControls
            | undefined) ?? DEFAULT_BOARD_CONTROLS
        setBoardControls(initialBoardControls)
        onLoad?.(initialBoardControls)

        isSetup.current = true
      } catch (error_: any) {
        setError(error_)
      }
    }

    if (isSetup.current === false) {
      setup()
    }
  }, [channelName])

  const updateBoardControls = useCallback(
    (updates: Partial<BoardControls>) => {
      if (!root) return

      const current =
        (root.get(BOARD_CONTROLS_KEY).compact() as BoardControls | undefined) ??
        DEFAULT_BOARD_CONTROLS
      const newControls = {
        ...current,
        ...updates,
      }
      root.set(BOARD_CONTROLS_KEY, newControls)
    },
    [root],
  )

  return { boardControls, error, updateBoardControls }
}
