import { useBoardControlsState } from '@/providers/retro-board/controls'

export function Audio() {
  const audioRef = useBoardControlsState(s => s.audioRef)
  return (
    <audio className='hidden' loop ref={audioRef} preload='auto'>
      <track kind='captions' srcLang='en' label='Track Name' />
    </audio>
  )
}
