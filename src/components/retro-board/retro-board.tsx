'use client'

import { useState } from 'react'
import { AblyChannelProvider } from '../ably'
import { CommentsSidebar } from '../comments-sidebar'
import { SignInGate } from '../signin-gate'
import { BadColumn, GoodColumn, ShoutoutColumn, MehColumn } from './columns'
import { COLUMN_CLASSES, COLUMN_CONTAINER_CLASSES } from './constants'
import { RetroBoardProvider } from './provider/retro-board-provider'
import { RetroBoardHeader } from './retro-board-header'
import { useAuth } from '@/hooks/use-auth'
import { CommentsSidebarProvider } from '@/providers/comments-sidebar'
import type { Board } from '@/types'

export function RetroBoard({ board }: Readonly<{ board: Board }>) {
  const { status, isAuthenticated } = useAuth()
  const [continueAnyway, setContinueAnyway] = useState(false)

  if (status === 'loading') {
    return <div className='h-full w-screen' />
  }

  const shouldShowGate =
    status === 'unauthenticated' && !isAuthenticated && !continueAnyway

  if (shouldShowGate) {
    return (
      <SignInGate
        isPrivate={board.isPrivate}
        onContinueAsGuest={() => setContinueAnyway(true)}
      />
    )
  }

  return (
    <AblyChannelProvider channel={board.id}>
      <RetroBoardProvider board={board}>
        <CommentsSidebarProvider boardId={board.id}>
          <RetroBoardHeader id={board.id} />
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
