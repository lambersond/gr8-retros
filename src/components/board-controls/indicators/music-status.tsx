import { Volume } from 'lucide-react'
import { MusicIcon } from '@/components/common/icons'
import { useBoardControlsState } from '@/providers/retro-board/controls'

export function MusicStatus() {
  const isPlaying = useBoardControlsState(s => s.play)

  return (
    <div className='flex items-center'>
      <Volume className='min-w-5 min-h-5 -mr-1.5' />
      <MusicIcon height='sm' intent='primary' bars={5} isPlaying={isPlaying} />
    </div>
  )
}
