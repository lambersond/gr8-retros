'use client'

import { useState } from 'react'
import { LockIcon, LogInIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  AccessRequestUserListener,
  type AccessRequestResolvedMessage,
} from '@/components/access-request-listener'
import { useAuth } from '@/hooks/use-auth'
import { useModals } from '@/hooks/use-modals'
import type {
  AccessRequestStatusValue,
  RequestAccessScreenProps,
} from './types'

export function RequestAccessScreen({
  access,
  isAuthenticated,
}: Readonly<RequestAccessScreenProps>) {
  const { openModal } = useModals()
  const router = useRouter()
  const {
    user: { id: userId },
  } = useAuth()
  const [status, setStatus] = useState<AccessRequestStatusValue>(
    access.requestStatus,
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string>()

  // When a manager approves, re-running the server load drops the now-member
  // straight into the board; rejection flips the screen to "declined".
  const handleResolved = (message: AccessRequestResolvedMessage) => {
    if (message.boardId !== access.boardId) return
    if (message.type === 'ACCESS_REQUEST_APPROVED') {
      router.refresh()
    } else {
      setStatus('REJECTED')
    }
  }

  const requestAccess = async () => {
    setSubmitting(true)
    setError(undefined)
    try {
      const res = await fetch(
        `/api/board-settings/${access.settingsId}/access-request`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' } },
      )
      if (res.ok) {
        setStatus('PENDING')
      } else {
        const body = await res.json().catch(() => ({}))
        setError(body.message ?? 'Could not submit your request.')
      }
    } catch {
      setError('Could not submit your request.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='flex h-full w-screen items-center justify-center px-4 py-8'>
      <div className='w-full max-w-lg rounded-xl bg-appbar p-6 shadow-xl flex flex-col gap-6'>
        <header className='space-y-2'>
          <div className='flex items-center gap-2'>
            <LockIcon className='size-6 text-primary' />
            <h1 className='text-3xl font-bold'>{access.boardName}</h1>
          </div>
          <p className='text-sm text-text-primary/80'>
            This is a <span className='font-semibold'>private</span> board.
          </p>
        </header>

        {!isAuthenticated && (
          <>
            <p className='text-base text-text-primary'>
              Sign in to request access from a board manager.
            </p>
            <button
              type='button'
              className='inline-flex items-center cursor-pointer justify-center gap-3 rounded-md border border-transparent bg-black/80 px-4 py-2.5 text-base font-medium text-white hover:border-primary hover:bg-black focus:outline-none focus:ring-2 focus:ring-white/60'
              onClick={() =>
                openModal('SignInModal', {
                  redirectTo: globalThis.location.href,
                } as never)
              }
            >
              <LogInIcon className='size-5' />
              Sign In
            </button>
          </>
        )}

        {isAuthenticated && status === 'NONE' && (
          <>
            <p className='text-base text-text-primary'>
              You&apos;re not a member of this board yet. Request access and a
              board manager will review it.
            </p>
            {error && <p className='text-sm text-danger'>{error}</p>}
            <button
              type='button'
              disabled={submitting}
              className='inline-flex items-center justify-center rounded-md bg-primary/85 px-4 py-2.5 text-base font-bold text-text-primary hover:bg-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
              onClick={requestAccess}
            >
              {submitting ? 'Requesting…' : 'Request Access'}
            </button>
          </>
        )}

        {isAuthenticated && status === 'PENDING' && (
          <p className='text-base text-text-primary'>
            Your access request is{' '}
            <span className='font-semibold text-warning'>pending</span>.
            You&apos;ll be able to join once a board manager approves it.
          </p>
        )}

        {isAuthenticated && status === 'PENDING' && userId && (
          <AccessRequestUserListener
            userId={userId}
            onResolved={handleResolved}
          />
        )}

        {isAuthenticated && status === 'REJECTED' && (
          <p className='text-base text-text-primary'>
            Your access request was{' '}
            <span className='font-semibold text-danger'>declined</span>.
          </p>
        )}
      </div>
    </div>
  )
}
