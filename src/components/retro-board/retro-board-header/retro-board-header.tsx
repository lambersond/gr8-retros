import { RetroActions } from './retro-actions'
import { Countdown } from '@/components/countdown'

export function RetroBoardHeader({ id }: Readonly<{ id: string }>) {
  return (
    <div className='bg-appbar/50 py-2 px-3 relative'>
      <Countdown id={id} />
      <RetroActions id={id} />
    </div>
  )
}
