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
        'flex gap-2 items-center px-2 py-1 bg-success text-white rounded-md hover:bg-success/90 active:bg-success/80 transition tracking-tight text-xs font-small fixed left-1/2 transform -translate-x-1/2 mt-1 z-20 cursor-pointer',
        {
          'animate-bounce fade-in': showBounceAnimation,
        },
      )}
      onClick={e => {
        e.stopPropagation()
        e.preventDefault()
        submitVotes()
      }}
    >
      <Check className='size-4' /> I&apos;m done
    </button>
  )
}
