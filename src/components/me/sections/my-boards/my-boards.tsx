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
}: Readonly<MyBoardsProps>) {
  const boardsData = await myBoards
  const userInfoData = await userInfo
  const boards = boardsData?.boards ?? []
  const ownedCount = boards.filter(b => b.role === 'OWNER').length
  const boardLimit =
    MAX_BOARDS_PER_SUBSCRIPTION[userInfoData?.paymentTier || PaymentTier.FREE]

  return (
    <SectionCard
      label={
        <div className='flex items-center justify-between'>
          My Boards ({boards.length}/{boardLimit})
          <NewBoardButton boardLimit={boardLimit} ownedCount={ownedCount} />
        </div>
      }
    >
      {boards.length === 0 ? (
        <p className='text-sm text-slate-400 text-center py-4'>
          No boards yet.
        </p>
      ) : (
        <ul className='flex flex-col gap-2 py-2'>
          {boards.map(board => {
            const retroSession = board.settings?.retroSession
            return (
              <Link
                key={retroSession.id}
                className='flex items-center justify-between gap-3 rounded-xl px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer group border border-primary/10'
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
    </SectionCard>
  )
}
