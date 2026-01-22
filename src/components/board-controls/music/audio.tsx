import { useBoardControlsState } from '@/providers/retro-board/controls'

export function Audio() {
  const refs = useBoardControlsState(s => ({
    musicRef: s.musicRef,
    tickingRef: s.tickingRef,
    dingRef: s.dingRef,
  }))
  return (
    <div className='hidden'>
      <audio className='hidden' loop ref={refs.musicRef} preload='auto'>
        <track kind='captions' srcLang='en' label='Track Name' />
      </audio>
      <audio src='/sounds/ticking.mp3' ref={refs.tickingRef} preload='auto'>
        <track kind='captions' srcLang='en' label='Ticking Sound' />
      </audio>
      <audio src='/sounds/ding.mp3' ref={refs.dingRef} preload='auto'>
        <track kind='captions' srcLang='en' label='Ding Sound' />
      </audio>
    </div>
  )
}
