'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { BoardSettingsSidebar } from '../board-settings-sidebar'
import { CommentsSidebar } from '../comments-sidebar'
import { SignInGate } from '../signin-gate'
import { BadColumn, GoodColumn, ShoutoutColumn, MehColumn } from './columns'
import { COLUMN_CLASSES, COLUMN_CONTAINER_CLASSES } from './constants'
import { RetroBoardHeader } from './retro-board-header'
import { RetroBoardProviders } from './retro-board-providers'
import { useAuth } from '@/hooks/use-auth'
import { AblyChannelProvider } from '@/providers/ably'
import type { Board } from '@/types'

export function RetroBoard({ board }: Readonly<{ board: Board }>) {
  const { status, isAuthenticated } = useAuth()

  const searchParams = useSearchParams()
  const isGuest = searchParams.get('guest') === 'true'
  const [continueAnyway, setContinueAnyway] = useState(isGuest)

  if (status === 'loading') {
    return <div className='h-full w-screen' />
  }

  const shouldShowGate =
    status === 'unauthenticated' && !isAuthenticated && !continueAnyway

  if (shouldShowGate) {
    return (
      <SignInGate
        isPrivate={board.settings.isPrivate}
        onContinueAsGuest={() => setContinueAnyway(true)}
      />
    )
  }

  return (
    <AblyChannelProvider channel={board.id}>
      <RetroBoardProviders board={board}>
        <RetroBoardHeader id={board.id} />
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
        <BoardSettingsSidebar />
      </RetroBoardProviders>
    </AblyChannelProvider>
  )
}
