'use client'

import { AblyChannelProvider } from '../ably'
import { BadColumn, GoodColumn, ShoutoutColumn, MehColumn } from './columns'
import { RetroBoardProvider } from './provider/retro-board-provider'
import type { Board } from '@/types'

export function RetroBoard({ board }: Readonly<{ board: Board }>) {
  return (
    <AblyChannelProvider channel={board.id}>
      <RetroBoardProvider board={board}>
        <div className='flex-1 min-h-0 hidden lg:grid grid-rows-1 lg:grid-cols-4 gap-3 p-3 overflow-hidden'>
          <GoodColumn />
          <MehColumn />
          <BadColumn />
          <ShoutoutColumn />
        </div>
      </RetroBoardProvider>
    </AblyChannelProvider>
  )
}
