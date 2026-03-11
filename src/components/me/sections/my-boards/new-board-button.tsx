'use client'

import { PlusIcon } from 'lucide-react'
import { Tooltip } from '@/components/common'
import { useModals } from '@/hooks/use-modals'
import type { NewBoardButtonProps } from './types'

export function NewBoardButton({
  boardLimit,
  ownedCount,
}: Readonly<NewBoardButtonProps>) {
  const { openModal } = useModals()
  const isAtLimit = ownedCount >= boardLimit

  const handleClick = () => {
    openModal('CreateBoardModal', {})
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
        className='cursor-pointer flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-white bg-primary-new/80 hover:not-disabled:bg-primary-new transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:not-disabled:shadow-sm'
        disabled={isAtLimit}
        onClick={handleClick}
      >
        <PlusIcon className='h-3.5 w-3.5' />
        New Board
      </button>
    </Tooltip>
  )
}
