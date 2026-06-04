'use client'

import { useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie'
import { useSearchParams } from 'next/navigation'
import { BoardSettingsSidebar } from '../board-settings-sidebar'
import { CommentsSidebar } from '../comments-sidebar'
import { SideEffectsHandler } from '../side-effects-handler'
import { SignInGate } from '../signin-gate'
import { BoardShareButton } from './board-share-button'
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

  const shouldShowGate =
    status === 'unauthenticated' && !isAuthenticated && !continueAnyway

  // Show the retro tips at most once per mount, and never once acknowledged
  // (the cookie is set on close for everyone). The ref guard keeps incidental
  // re-renders — session refetch, window focus — from re-opening it.
  const hasPromptedTipsRef = useRef(false)
  useEffect(() => {
    if (shouldShowGate || status === 'loading') return
    if (hasPromptedTipsRef.current) return
    if (Cookies.get(COOKIE_KEY_RETRO_TIPS_ACK)) return
    hasPromptedTipsRef.current = true
    openModal('GoodRetroModal', {})
  }, [shouldShowGate, status, openModal])

  if (status === 'loading') {
    return <div className='h-full w-screen' />
  }

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
        <BoardShareButton id={board.id} />
        <RetroBoardHeader id={board.id} />
        <RetroBoardColumns />
        <CommentsSidebar />
        <SideEffectsHandler />
        <BoardSettingsSidebar />
      </RetroBoardProviders>
    </AblyChannelProvider>
  )
}
