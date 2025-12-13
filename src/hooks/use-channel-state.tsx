import { useEffect, useRef, useState } from 'react'
import * as Ably from 'ably'
import { useAbly } from 'ably/react'

const BOARD_CONTROLS_KEY = 'boardControls'
type BoardControlsKey = typeof BOARD_CONTROLS_KEY

type BoardControlsMap = {
  [BOARD_CONTROLS_KEY]: {
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
  }
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
  },
}

export function useBoardControlsLiveMap(
  channelName: string,
  defaultTimerDuration = 300,
) {
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
          boardControls: Ably.LiveMap<BoardControlsMap> | undefined
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
        setBoardControls(
          boardControlsMap.get(BOARD_CONTROLS_KEY) ||
            DEFAULT_BOARD_CONTROLS[BOARD_CONTROLS_KEY],
        )
        isSetup.current = true
      } catch (error_: any) {
        setError(error_)
      }
    }

    if (isSetup.current === false) {
      setup()
    }
  }, [channelName])

  function updateBoardControls(
    updates: Partial<BoardControlsMap[BoardControlsKey]>,
  ) {
    if (!map) return

    const current =
      map.get(BOARD_CONTROLS_KEY) || DEFAULT_BOARD_CONTROLS[BOARD_CONTROLS_KEY]
    const newControls = {
      ...current,
      ...updates,
    }
    map.set(BOARD_CONTROLS_KEY, newControls)
  }

  return { map, boardControls, error, updateBoardControls }
}
