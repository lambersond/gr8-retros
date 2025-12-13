import * as React from 'react'
import { Volume1, Volume2, VolumeX } from 'lucide-react'

type VolumeSliderProps = {
  audioRef: React.RefObject<HTMLAudioElement | null>
  defaultVolume?: number // 0..1
  storageKey?: string
  className?: string
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

const VolumeIcon = ({ volume }: { volume: number }) => {
  if (volume === 0) return VolumeX
  if (volume < 0.5) return Volume1
  return Volume2
}

export function VolumeSlider({
  audioRef,
  defaultVolume = 0.6,
  storageKey = 'music:volume',
}: Readonly<VolumeSliderProps>) {
  const [volume, setVolume] = React.useState(() => {
    if (globalThis.window === undefined) return clamp01(defaultVolume)
    const stored = globalThis.localStorage.getItem(storageKey)
    const parsed = stored ? Number(stored) : Number.NaN
    return Number.isFinite(parsed) ? clamp01(parsed) : clamp01(defaultVolume)
  })

  React.useEffect(() => {
    const el = audioRef.current
    if (!el) return
    el.volume = clamp01(volume)
  }, [audioRef, volume])

  // Persist locally only
  React.useEffect(() => {
    if (globalThis.window === undefined) return
    globalThis.localStorage.setItem(storageKey, String(volume))
  }, [storageKey, volume])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(clamp01(Number(e.target.value)))
  }

  return (
    <div className='flex items-center gap-3'>
      {React.createElement(VolumeIcon({ volume }), {
        className: 'size-5 text-primary',
      })}
      <input
        aria-label='Volume'
        type='range'
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={handleChange}
        className='
          h-0.5 w-99/100 cursor-pointer appearance-none rounded-full bg-tertiary/60

          hover:bg-info/70
          focus:outline-none
        '
      />
    </div>
  )
}
