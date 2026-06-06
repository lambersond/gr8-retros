import Link from 'next/link'
import { NewBoardButton } from './new-board-button'
import { BoardRole } from '@/components/badges/board-role'
import { SectionCard } from '@/components/section-card'
import { MAX_BOARDS_PER_SUBSCRIPTION } from '@/constants'
import { PaymentTier } from '@/enums'
import type { MyBoardsProps } from './types'

export async function MyBoards({
  myBoards,
  userInfo,
  myPendingRequests,
}: Readonly<MyBoardsProps>) {
  const boardsData = await myBoards
  const userInfoData = await userInfo
  const pendingRequests = await myPendingRequests
  const boards = boardsData?.boards ?? []
  const ownedCount = boards.filter(b => b.role === 'OWNER').length
  const boardLimit =
    MAX_BOARDS_PER_SUBSCRIPTION[userInfoData?.paymentTier || PaymentTier.FREE]

  return (
    <SectionCard
      label={
        <div className='flex items-center justify-between'>
          My Boards ({ownedCount}/{boardLimit})
          <NewBoardButton boardLimit={boardLimit} ownedCount={ownedCount} />
        </div>
      }
    >
      {boards.length === 0 ? (
        <p className='text-sm text-text-secondary text-center py-4'>
          No boards yet.
        </p>
      ) : (
        <ul className='flex flex-col gap-2 py-2'>
          {boards.map(board => {
            const retroSession = board.settings?.retroSession
            return (
              <Link
                key={retroSession.id}
                className='flex items-center justify-between gap-3 rounded-xl px-4 py-3 bg-card transition-colors cursor-pointer group border border-border-light hover:border-primary'
                href={`/retro/${retroSession.id}`}
              >
                <span className='text-sm text-text-primary/90 font-bold truncate group-hover:text-text-primary transition-all'>
                  {retroSession.name ?? 'Untitled Board'}
                </span>
                <BoardRole role={board.role} />
              </Link>
            )
          })}
        </ul>
      )}

      {pendingRequests.length > 0 && (
        <div className='mt-3 pt-3 border-t border-border-light'>
          <p className='text-xs font-semibold tracking-wide uppercase text-text-secondary mb-2'>
            Pending access requests
          </p>
          <ul className='flex flex-col gap-2'>
            {pendingRequests.map(request => (
              <li
                key={request.settings.retroSessionId}
                className='flex items-center justify-between gap-3 rounded-xl px-4 py-2 bg-card border border-border-light'
              >
                <span className='text-sm text-text-primary/90 truncate'>
                  {request.settings.retroSession.name ?? 'Untitled Board'}
                </span>
                <span className='text-xs font-semibold text-warning flex-shrink-0'>
                  Pending
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </SectionCard>
  )
}
