'use client'

import { BoardRoleBadge } from '@/components/badges'
import { useBoardMembership } from '@/providers/board-memberships'
import type { BoardSectionProps } from './types'

export function BoardSection({ isAuthenticated }: Readonly<BoardSectionProps>) {
  const { boards } = useBoardMembership()

  if (!isAuthenticated) return

  return (
    <section>
      <p className='font-bold text-md mb-2 uppercase text-text-primary/75'>
        Boards
      </p>
      <span className='flex flex-col gap-2'>
        {boards.length > 0 ? (
          boards.map(({ boardId, role }) => (
            <a
              key={boardId}
              className='p-3 bg-white/80 rounded-lg block hover:bg-white transition-colors border border-border-light  flex justify-between items-center hover:border-primary-new shadow-sm'
              href={`/retro/${boardId}`}
            >
              <p className='font-semibold'>{boardId}</p>
              <BoardRoleBadge role={role} />
            </a>
          ))
        ) : (
          <p className='text-text-secondary'>
            You&apos;re not a member of any boards.
          </p>
        )}
      </span>
    </section>
  )
}
