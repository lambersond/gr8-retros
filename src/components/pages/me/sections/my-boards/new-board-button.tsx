'use client'

import { PlusIcon } from 'lucide-react'
import { Tooltip } from '@/components/common'
import { useModals } from '@/hooks/use-modals'
import { useBoardMemberships } from '@/providers/board-memberships'
import type { NewBoardButtonProps } from './types'

export function NewBoardButton({
  boardLimit,
  ownedCount,
}: Readonly<NewBoardButtonProps>) {
  const { openModal } = useModals()
  const isAtLimit = ownedCount >= boardLimit
  const { ensureBoardInCache } = useBoardMemberships()

  const handleClick = () => {
    openModal('CreateBoardModal', {
      onSubmit: async ({ boardId }: { boardId: string }) => {
        await ensureBoardInCache(boardId)
      },
    })
  }

  return (
    <Tooltip
      title={
        isAtLimit ? (
          <p>
            You&apos;ve reached your limit of <b>{boardLimit}</b> boards
          </p>
        ) : undefined
      }
      asChild
    >
      <button
        className='cursor-pointer flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-white bg-primary/80 hover:not-disabled:bg-primary transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:not-disabled:shadow-sm'
        disabled={isAtLimit}
        onClick={handleClick}
      >
        <PlusIcon className='h-3.5 w-3.5' />
        New Board
      </button>
    </Tooltip>
  )
}
