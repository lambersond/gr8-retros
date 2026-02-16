import { AudioTrack } from '@/components/audio-track'
import { useBoardControlsState } from '@/providers/retro-board/controls'

export function AudioRefs() {
  const refs = useBoardControlsState(s => ({
    musicRef: s.musicRef,
    tickingRef: s.tickingRef,
    dingRef: s.dingRef,
  }))
  return (
    <div className='hidden'>
      <AudioTrack ref={refs.musicRef} label='Sound Track' loop />
      <AudioTrack
        src='/sounds/ticking.mp3'
        ref={refs.tickingRef}
        label='Ticking Sound'
      />
      <AudioTrack
        src='/sounds/ding.mp3'
        ref={refs.dingRef}
        label='Ding Sound'
      />
    </div>
  )
}
