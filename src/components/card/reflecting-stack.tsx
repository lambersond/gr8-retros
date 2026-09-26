'use client'

import { EyeOff } from 'lucide-react'

// Shown for other people's cards during the guided Reflect phase: the card
// exists (so you can see the group is writing) but its content and author stay
// hidden until reveal. The animated color ring (see .reflect-ring in
// globals.css) wraps the top card, with the "deck" peeking out below it so
// nothing overlaps the ring.
export function ReflectingStack({
  count,
  ringStyle,
}: Readonly<{ count: number; ringStyle?: React.CSSProperties }>) {
  if (count <= 0) return

  return (
    <div className='flex flex-col'>
      <div className='reflect-ring' style={ringStyle}>
        <div className='flex items-center gap-2 rounded-lg bg-card p-3 text-text-secondary'>
          <EyeOff className='size-4 shrink-0' />
          <span className='text-sm italic'>
            {count} {count === 1 ? 'reflection' : 'reflections'} hidden
          </span>
        </div>
      </div>
      <div className='flex flex-col items-center'>
        <div className='h-2 w-[95%] rounded-b-lg border border-t-0 border-border-light bg-card opacity-70' />
        <div className='h-2 w-[90%] rounded-b-lg border border-t-0 border-border-light bg-card opacity-40' />
      </div>
    </div>
  )
}
