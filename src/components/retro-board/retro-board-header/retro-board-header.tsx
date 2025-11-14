import { RetroActions } from './retro-actions'

export function RetroBoardHeader({ id }: Readonly<{ id: string }>) {
  return (
    <div className='bg-appbar/50 py-2 px-3'>
      <RetroActions id={id} />
    </div>
  )
}
