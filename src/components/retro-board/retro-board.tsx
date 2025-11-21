'use client'

import { AblyChannelProvider } from '../ably'
import { CommentsProvider } from '../comments/comments-provider'
import { BadColumn, GoodColumn, ShoutoutColumn, MehColumn } from './columns'
import { RetroBoardProvider } from './provider/retro-board-provider'
import { RetroBoardHeader } from './retro-board-header'
import type { Board } from '@/types'

export function RetroBoard({ board }: Readonly<{ board: Board }>) {
  return (
    <AblyChannelProvider channel={board.id}>
      <RetroBoardProvider board={board}>
        <CommentsProvider>
          <RetroBoardHeader id={board.id} />
          <div className='lg:hidden flex-1 min-h-0 flex flex-col items-center justify-center align-middle'>
            Mobile and tablet view coming soon!
          </div>
          <div className='flex-1 min-h-0 hidden lg:grid grid-rows-1 lg:grid-cols-4 gap-3 p-3 overflow-hidden'>
            <GoodColumn />
            <MehColumn />
            <BadColumn />
            <ShoutoutColumn />
          </div>
        </CommentsProvider>
      </RetroBoardProvider>
    </AblyChannelProvider>
  )
}
