import { MusicVolumeSlider } from './music-volume-slider'
import { useBoardControlsState } from '@/providers/retro-board/controls'

export function VolumeControl() {
  const audioRef = useBoardControlsState(s => s.musicRef)
  return <MusicVolumeSlider audioRef={audioRef} />
}
