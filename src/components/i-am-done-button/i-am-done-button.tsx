'use client'

import clsx from 'clsx'
import { Check } from 'lucide-react'
import {
  useBoardControlsActions,
  useBoardControlsState,
} from '@/providers/retro-board/controls'
import type { IAmDoneButtonProps } from './types'

export function IAmDoneButton({
  showBounceAnimation = false,
}: Readonly<IAmDoneButtonProps>) {
  const { submitVotes } = useBoardControlsActions(a => ({
    submitVotes: a.submitVotes,
  }))

  const { hasVoted } = useBoardControlsState(s => ({
    hasVoted: s.hasVoted,
  }))

  if (hasVoted) {
    return
  }

  return (
    <button
      className={clsx(
        'flex gap-2 items-center px-4 py-2 text-sm font-bold bg-success text-white rounded-md hover:bg-success/90 active:bg-success/80 tracking-tight fixed left-1/2 -translate-x-1/2 z-50 cursor-pointer origin-center duration-500 ease-out',
        showBounceAnimation
          ? 'top-5 scale-125 animate-bounce fade-in shadow-lg shadow-success/30 ring-2 ring-success/50 ring-offset-2 ring-offset-transparent'
          : 'top-3.5 scale-75',
      )}
      onClick={e => {
        e.stopPropagation()
        e.preventDefault()
        submitVotes()
      }}
    >
      <Check className='size-5' />
      Cast My Votes
    </button>
  )
}
