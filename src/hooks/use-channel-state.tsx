import { useCallback, useEffect, useRef, useState } from 'react'
import * as Ably from 'ably'
import { useAbly } from 'ably/react'
import { VotingMode, VotingState } from '@/enums'

const BOARD_CONTROLS_KEY = 'boardControlsV3'
type BoardControlsKey = typeof BOARD_CONTROLS_KEY

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
}

type BoardControlsMap = {
  [BOARD_CONTROLS_KEY]: BoardControls
}

const DEFAULT_BOARD_CONTROLS: BoardControlsMap = {
  [BOARD_CONTROLS_KEY]: {
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
  },
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
  const [map, setMap] = useState<Ably.LiveMap<BoardControlsMap>>()
  const [boardControls, setBoardControls] = useState<
    BoardControlsMap[BoardControlsKey]
  >(DEFAULT_BOARD_CONTROLS[BOARD_CONTROLS_KEY])
  const [error, setError] = useState<Error>()
  const ably = useAbly()
  const isSetup = useRef(false)

  useEffect(() => {
    const channel = ably.channels.get(channelName)
    async function setup() {
      try {
        // Get the root map for this channel
        const root = await channel.objects.getRoot<{
          [BOARD_CONTROLS_KEY]: Ably.LiveMap<BoardControlsMap> | undefined
        }>()

        // Try to get existing players map
        let boardControlsMap = root.get(BOARD_CONTROLS_KEY)

        // If it doesn't exist yet, create it and store
        if (!boardControlsMap) {
          const initialControls = {
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
          }
          boardControlsMap = await channel.objects.createMap<BoardControlsMap>({
            [BOARD_CONTROLS_KEY]: initialControls,
          })
          await root.set(BOARD_CONTROLS_KEY, boardControlsMap)
        }

        boardControlsMap.subscribe(({ update }) => {
          if (update[BOARD_CONTROLS_KEY] === 'updated') {
            const updatedMap = root.get(BOARD_CONTROLS_KEY)
            setBoardControls(
              updatedMap?.get(BOARD_CONTROLS_KEY) ||
                DEFAULT_BOARD_CONTROLS[BOARD_CONTROLS_KEY],
            )
          }
        })

        setMap(boardControlsMap)

        const initialBoardControls =
          boardControlsMap.get(BOARD_CONTROLS_KEY) ||
          DEFAULT_BOARD_CONTROLS[BOARD_CONTROLS_KEY]
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
    (updates: Partial<BoardControlsMap[BoardControlsKey]>) => {
      if (!map) return

      const current =
        map.get(BOARD_CONTROLS_KEY) ||
        DEFAULT_BOARD_CONTROLS[BOARD_CONTROLS_KEY]
      const newControls = {
        ...current,
        ...updates,
      }
      map.set(BOARD_CONTROLS_KEY, newControls)
    },
    [map],
  )

  return { map, boardControls, error, updateBoardControls }
}
