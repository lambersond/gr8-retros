import * as React from 'react'
import { Volume1, Volume2, VolumeX } from 'lucide-react'
import { VOLUME_STORAGE_KEY } from '@/constants'
import { clamp01 } from '@/utils/clamp01'

type MusicVolumeSliderProps = {
  defaultVolume?: number
  storageKey?: string
  className?: string
}

const VolumeIcon = ({ volume }: { volume: number }) => {
  if (volume === 0) return VolumeX
  if (volume < 0.5) return Volume1
  return Volume2
}

export function MusicVolumeSlider({
  defaultVolume = 0.6,
  storageKey = VOLUME_STORAGE_KEY,
}: Readonly<MusicVolumeSliderProps>) {
  const [volume, setVolume] = React.useState(() => {
    if (globalThis.window === undefined) return clamp01(defaultVolume)
    const stored = localStorage.getItem(storageKey)
    const parsed = stored ? Number(stored) : Number.NaN
    return Number.isFinite(parsed) ? clamp01(parsed) : clamp01(defaultVolume)
  })

  React.useEffect(() => {
    if (globalThis.window === undefined) return
    localStorage.setItem(storageKey, String(volume))
    globalThis.dispatchEvent(
      new CustomEvent('volume-change', { detail: { key: storageKey, volume } }),
    )
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
        className='h-0.5 w-99/100 cursor-pointer appearance-none rounded-full bg-tertiary/60 hover:bg-info/40 focus:outline-none'
      />
    </div>
  )
}
