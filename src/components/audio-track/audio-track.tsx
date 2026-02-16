import { useEffect } from 'react'
import { getStoredVolume } from './utils'
import { VOLUME_STORAGE_KEY } from '@/constants'
import { clamp01 } from '@/utils/clamp01'
import type { AudioTrackProps } from './types'

export function AudioTrack({
  src,
  loop = false,
  label = 'Track Name',
  ref,
  className,
}: Readonly<AudioTrackProps>) {
  useEffect(() => {
    const el = ref?.current
    if (!el) return

    const applyVolume = (v: number) => {
      el.volume = clamp01(v)
    }

    applyVolume(getStoredVolume(VOLUME_STORAGE_KEY))

    const onVolumeChange = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (detail?.key === VOLUME_STORAGE_KEY) {
        applyVolume(detail.volume)
      }
    }

    const onStorage = (e: StorageEvent) => {
      if (e.key === VOLUME_STORAGE_KEY && e.newValue != undefined) {
        applyVolume(Number(e.newValue))
      }
    }

    globalThis.addEventListener('volume-change', onVolumeChange)
    globalThis.addEventListener('storage', onStorage)
    return () => {
      globalThis.removeEventListener('volume-change', onVolumeChange)
      globalThis.removeEventListener('storage', onStorage)
    }
  }, [ref])

  return (
    <audio className={className} loop={loop} preload='auto' ref={ref}>
      <source src={src} type='audio/mpeg' />
      <track kind='captions' srcLang='en' label={label} />
    </audio>
  )
}
