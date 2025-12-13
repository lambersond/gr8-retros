'use client'

import clsx from 'classnames'
import { AblyChannelProvider } from '../ably'
import { CommentsSidebar } from '../comments-sidebar'
import { BadColumn, GoodColumn, ShoutoutColumn, MehColumn } from './columns'
import { RetroBoardProvider } from './provider/retro-board-provider'
import { RetroBoardHeader } from './retro-board-header'
import { CommentsSidebarProvider } from '@/providers/comments-sidebar'
import type { Board } from '@/types'

const COLUMN_CONTAINER_CLASSES = clsx(
  'flex-1 min-h-0 overflow-hidden',
  'flex gap-3 sm:gap-0 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth py-3 [-webkit-overflow-scrolling:touch]',
  'lg:grid lg:grid-cols-4 lg:gap-3 lg:p-3 lg:overflow-hidden lg:px-3',
)

const COLUMN_CLASSES = clsx(
  'snap-start w-full px-3 shrink-0 min-h-0',
  'sm:w-1/2 sm:px-2',
  'lg:snap-none lg:w-auto lg:px-0 lg:shrink lg:min-h-full',
)

export function RetroBoard({ board }: Readonly<{ board: Board }>) {
  return (
    <AblyChannelProvider channel={board.id}>
      <RetroBoardProvider board={board}>
        <CommentsSidebarProvider boardId={board.id}>
          <RetroBoardHeader id={board.id} />{' '}
          {/* Mobile/Tablet: swipe between columns */}
          <div className={COLUMN_CONTAINER_CLASSES}>
            <div className={COLUMN_CLASSES}>
              <GoodColumn />
            </div>

            <div className={COLUMN_CLASSES}>
              <MehColumn />
            </div>

            <div className={COLUMN_CLASSES}>
              <BadColumn />
            </div>

            <div className={COLUMN_CLASSES}>
              <ShoutoutColumn />
            </div>
          </div>
          <CommentsSidebar />
        </CommentsSidebarProvider>
      </RetroBoardProvider>
    </AblyChannelProvider>
  )
}
