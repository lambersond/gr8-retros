'use client'

import { useState } from 'react'
import clsx from 'clsx'
import { TimeInput, usePopover } from '@/components/common'
import { useBoardControlsActions } from '@/providers/retro-board/controls'

const PRESET_MINUTES = [1, 2, 3, 5, 10, 15]

// Opened from the remote's center. A preset sets the countdown and closes in
// one tap; the input takes an exact mm:ss. Setting the time while the timer
// runs keeps it running from the new value, same as the board-controls panel.
export function QuickTimeSetter({
  initialSeconds,
}: Readonly<{ initialSeconds: number }>) {
  const popover = usePopover()
  const setSeconds = useBoardControlsActions(a => a.setSeconds)
  // Seeded once on open rather than following the live countdown, so the
  // ticking timer doesn't overwrite what's being typed.
  const [draft, setDraft] = useState(initialSeconds)

  const handlePreset = (minutes: number) => {
    setSeconds(minutes * 60)
    popover.setOpen(false)
  }

  const handleTyped = (seconds: number) => {
    setDraft(seconds)
    setSeconds(seconds)
  }

  return (
    <div className='flex flex-col gap-3 rounded-xl border border-tertiary bg-paper p-4 shadow'>
      <p className='font-bold tracking-tight text-text-primary'>
        Set time limit
      </p>
      <div className='grid grid-cols-3 gap-2'>
        {PRESET_MINUTES.map(minutes => (
          <button
            key={minutes}
            type='button'
            onClick={() => handlePreset(minutes)}
            className={clsx(
              'cursor-pointer rounded-md border py-1.5 text-sm font-medium transition hover:border-info hover:bg-primary/10',
              draft === minutes * 60
                ? 'border-info bg-primary/10 text-primary'
                : 'border-border-light text-text-primary',
            )}
          >
            {minutes} min
          </button>
        ))}
      </div>
      <TimeInput value={draft} onChange={handleTyped} />
    </div>
  )
}
