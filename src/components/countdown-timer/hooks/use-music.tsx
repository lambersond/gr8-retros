import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MUSIC_OPTIONS } from '@/constants'
import type { DropdownOption } from '@/components/common'

type UseMusicReturn = {
  audioRef: React.RefObject<HTMLAudioElement | null>
  selectedTrackOption: DropdownOption
  isPlaying: boolean
  isAutoplayBlocked: boolean
  canAutoplay: boolean
  startMusic: (opts?: { force?: boolean }) => Promise<boolean>
  pauseMusic: () => void
  toggleMusic: () => Promise<boolean>
  changeTrack: (
    option: DropdownOption,
    opts?: { autoplay?: boolean },
  ) => Promise<void>
  changeTrackById: (
    trackId: string,
    opts?: { autoplay?: boolean },
  ) => Promise<void>
}

function isNotAllowedError(err: unknown) {
  return (
    err instanceof DOMException &&
    (err.name === 'NotAllowedError' || err.name === 'AbortError')
  )
}

export function useMusic(): UseMusicReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [selectedTrackOption, setSelectedTrackOption] =
    useState<DropdownOption>(MUSIC_OPTIONS[0])

  // “Unlocked” means the user has interacted with the document so play() should be allowed.
  const [canAutoplay, setCanAutoplay] = useState(false)
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  // If the board wants autoplay before we’re unlocked, remember it and retry on first interaction.
  const pendingAutoplayRef = useRef(false)

  // Keep isPlaying truthful even if audio is paused/played by OS controls, ends, etc.
  useEffect(() => {
    const el = audioRef.current
    if (!el) return

    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onEnded = () => setIsPlaying(false)

    el.addEventListener('play', onPlay)
    el.addEventListener('pause', onPause)
    el.addEventListener('ended', onEnded)

    return () => {
      el.removeEventListener('play', onPlay)
      el.removeEventListener('pause', onPause)
      el.removeEventListener('ended', onEnded)
    }
  }, [])

  const unlockAutoplay = useCallback(() => {
    setCanAutoplay(true)
    setIsAutoplayBlocked(false)

    // If we previously tried to autoplay and got blocked, retry immediately on this user gesture.
    if (pendingAutoplayRef.current) {
      pendingAutoplayRef.current = false
      audioRef.current?.play().catch(() => {
        // If this still fails, keep state conservative.
        setIsAutoplayBlocked(true)
        setCanAutoplay(false)
      })
    }
  }, [])

  // Global “any interaction unlocks autoplay”
  useEffect(() => {
    if (canAutoplay) return

    const handler = () => unlockAutoplay()

    const events: Array<keyof DocumentEventMap> = [
      'pointerdown',
      'mousedown',
      'touchstart',
      'keydown',
    ]

    // capture: true helps ensure we see the gesture even if some component stops propagation
    for (const evt of events)
      document.addEventListener(evt, handler, {
        once: true,
        passive: true,
        capture: true,
      })

    return () => {
      for (const evt of events)
        document.removeEventListener(evt, handler, { capture: true } as any)
    }
  }, [canAutoplay, unlockAutoplay])

  const startMusic = useCallback(
    async (opts?: { force?: boolean }) => {
      const el = audioRef.current
      if (!el) return false

      // If we haven’t had a user gesture yet, remember intent and mark as blocked.
      if (!canAutoplay && !opts?.force) {
        pendingAutoplayRef.current = true
        setIsAutoplayBlocked(true)
        return false
      }

      if (!el.paused) return true

      try {
        await el.play()
        setIsAutoplayBlocked(false)
        return true
      } catch (error) {
        if (isNotAllowedError(error)) {
          pendingAutoplayRef.current = true
          setIsAutoplayBlocked(true)
          setCanAutoplay(false)
        }
        return false
      }
    },
    [canAutoplay],
  )

  const pauseMusic = useCallback(() => {
    const el = audioRef.current
    if (!el || el.paused) return
    el.pause()
  }, [])

  const toggleMusic = useCallback(async () => {
    const el = audioRef.current
    if (!el) return false

    // A toggle is a user gesture → unlock immediately
    unlockAutoplay()

    if (!el.paused) {
      pauseMusic()
      return true
    }

    // force because we are inside a user gesture
    return startMusic({ force: true })
  }, [pauseMusic, startMusic, unlockAutoplay])

  const changeTrack = useCallback(
    async (option: DropdownOption, opts?: { autoplay?: boolean }) => {
      const el = audioRef.current
      const nextSrc = option.value
      if (!el || !nextSrc) return

      setSelectedTrackOption(option)

      // avoid reloading if already on the same src
      if (el.src !== nextSrc) {
        el.src = nextSrc
      }

      if (opts?.autoplay) {
        await startMusic()
      }
    },
    [startMusic],
  )

  const changeTrackById = useCallback(
    async (trackId: string, opts?: { autoplay?: boolean }) => {
      const option = MUSIC_OPTIONS.find(o => o.id === trackId)
      if (!option) return
      await changeTrack(option, opts)
    },
    [changeTrack],
  )

  return useMemo(
    () => ({
      audioRef,
      selectedTrackOption,
      isPlaying,
      isAutoplayBlocked,
      canAutoplay,
      startMusic,
      pauseMusic,
      toggleMusic,
      changeTrack,
      changeTrackById,
    }),
    [
      selectedTrackOption,
      isPlaying,
      isAutoplayBlocked,
      canAutoplay,
      startMusic,
      pauseMusic,
      toggleMusic,
      changeTrack,
      changeTrackById,
    ],
  )
}
