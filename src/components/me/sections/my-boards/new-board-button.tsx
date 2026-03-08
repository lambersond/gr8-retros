'use client'

import { PlusIcon } from 'lucide-react'
import { Tooltip } from '@/components/common'
import { useModals } from '@/hooks/use-modals'

export interface NewBoardButtonProps {
  boardLimit: number
  ownedCount: number
}

export function NewBoardButton({
  boardLimit,
  ownedCount,
}: Readonly<NewBoardButtonProps>) {
  const { openModal } = useModals()
  const isAtLimit = ownedCount >= boardLimit

  const handleClick = () => {
    openModal('ConfirmModal', {
      onSubmit: () => {},
    })
  }

  return (
    <Tooltip
      title={
        isAtLimit
          ? `You've reached your limit of ${boardLimit} boards`
          : undefined
      }
    >
      <button
        className='hidden cursor-pointer flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors disabled:cursor-not-allowed disabled:opacity-50'
        disabled={isAtLimit}
        onClick={handleClick}
      >
        <PlusIcon className='h-3.5 w-3.5' />
        New Board
      </button>
    </Tooltip>
  )
}
