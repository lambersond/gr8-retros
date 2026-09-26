'use client'

import { EyeOff } from 'lucide-react'

// Shown for other people's cards during the guided Reflect phase: the card
// exists (so you can see the group is writing) but its content and author stay
// hidden until the facilitator reveals everything by leaving Reflect. This is a
// cosmetic mask; the content is not fetched or displayed here.
export function CardHidden() {
  return (
    <div className='relative border border-border-light rounded-lg shadow-card flex flex-col bg-card w-full select-none'>
      <div className='flex items-center gap-2 p-3 text-text-secondary'>
        <EyeOff className='size-4 shrink-0' />
        <span className='text-sm italic'>Reflecting…</span>
      </div>
      <div className='flex flex-col gap-1.5 px-3 pb-3' aria-hidden>
        <div className='h-2.5 w-11/12 rounded bg-text-secondary/15' />
        <div className='h-2.5 w-3/4 rounded bg-text-secondary/15' />
      </div>
    </div>
  )
}
