import { RetroActions } from './retro-actions'
import { BoardControls } from '@/components/board-controls'

export function RetroBoardHeader({ id }: Readonly<{ id: string }>) {
  return (
    <div className='bg-appbar/50 py-2 px-3 h-13 relative'>
      <BoardControls />
      <RetroActions id={id} />
    </div>
  )
}
