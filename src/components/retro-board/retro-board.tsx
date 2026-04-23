'use client'

import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useSearchParams } from 'next/navigation'
import { BoardSettingsSidebar } from '../board-settings-sidebar'
import { CommentsSidebar } from '../comments-sidebar'
import { SideEffectsHandler } from '../side-effects-handler'
import { SignInGate } from '../signin-gate'
import { RetroBoardColumns } from './retro-board-columns'
import { RetroBoardHeader } from './retro-board-header'
import { RetroBoardProviders } from './retro-board-providers'
import { COOKIE_KEY_RETRO_TIPS_ACK } from '@/constants/cookies'
import { useAuth } from '@/hooks/use-auth'
import { useModals } from '@/hooks/use-modals'
import { AblyChannelProvider } from '@/providers/ably'
import type { Board } from '@/types'

export function RetroBoard({ board }: Readonly<{ board: Board }>) {
  const { status, isAuthenticated } = useAuth()
  const { openModal } = useModals()
  const searchParams = useSearchParams()
  const isGuest = searchParams.get('guest') === 'true'
  const [continueAnyway, setContinueAnyway] = useState(isGuest)

  useEffect(() => {
    if (isAuthenticated && !Cookies.get(COOKIE_KEY_RETRO_TIPS_ACK)) {
      openModal('GoodRetroModal', {})
    }
  }, [isAuthenticated, openModal])

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
        <RetroBoardColumns />
        <CommentsSidebar />
        <SideEffectsHandler />
        <BoardSettingsSidebar />
      </RetroBoardProviders>
    </AblyChannelProvider>
  )
}
