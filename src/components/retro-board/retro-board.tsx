'use client'

import { BadColumn, GoodColumn, ShoutoutColumn, MehColumn } from './columns'
import { RetroBoardProvider } from './provider/retro-board-provider'
import type { Board } from '@/types'

export function RetroBoard({ board }: Readonly<{ board: Board }>) {
  return (
    <RetroBoardProvider board={board}>
      <p className='p-3 lg:hidden'>Small Screen views under work</p>
      <div className='flex-1 min-h-0 hidden lg:grid grid-rows-1 lg:grid-cols-4 gap-3 p-3 overflow-hidden'>
        <GoodColumn />
        <MehColumn />
        <BadColumn />
        <ShoutoutColumn />
      </div>
    </RetroBoardProvider>
  )
}
