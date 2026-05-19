'use client'

import { useState } from 'react'
import clsx from 'clsx'
import {
  BookOpen,
  ChevronDown,
  LogInIcon,
  LogOutIcon,
  MessageCircleQuestion,
  UserCircle,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ColorModeToggle from '../color-mode-toggle'
import { BoardRoleBadge, PaymentTierBadge } from '@/components/badges'
import { IconButton, Popover } from '@/components/common'
import { useAuth } from '@/hooks/use-auth'
import { useModals } from '@/hooks/use-modals'
import { useBoardMemberships } from '@/providers/board-memberships'

function openSupport() {
  // Sleekplan is bootstrapped in src/app/layout.tsx — its SDK attaches an
  // `open()` method onto window.$sleek after the script loads.
  ;(globalThis as any).$sleek?.open?.()
}

export function Auth() {
  const { user, isAuthenticated, signOut } = useAuth()
  const pathname = usePathname()
  const { openModal } = useModals()

  if (!isAuthenticated) {
    const signInRedirectTo = pathname?.startsWith('/retro/') ? pathname : '/me'
    return (
      <IconButton
        icon={LogInIcon}
        size='xl'
        intent='primary'
        tooltip='Sign In'
        onClick={() =>
          openModal('SignInModal', { redirectTo: signInRedirectTo } as any)
        }
      />
    )
  }

  return (
    <Popover
      asChild
      placement='bottom-end'
      content={
        <div className='w-72 rounded-xl border border-border-light bg-paper shadow-xl overflow-hidden'>
          <div className='relative flex flex-col items-center px-4 pt-4 pb-3 border-b border-border-light'>
            <div className='absolute top-2 left-2'>
              <PaymentTierBadge tier={user.paymentTier} redirectToPlans />
            </div>
            <Image
              src={user.image}
              alt={user.name}
              width={72}
              height={72}
              className='rounded-full border border-border-light'
            />
            <p className='mt-2 font-semibold text-text-primary'>{user.name}</p>
          </div>

          <BoardsSection pathname={pathname} />

          <div className='flex flex-col py-1'>
            <Link
              href='/me'
              className='flex items-center gap-3 px-4 py-2 text-sm text-text-primary hover:bg-hover'
            >
              <UserCircle size={18} />
              My Account
            </Link>
            <Link
              href='/docs'
              className='flex items-center gap-3 px-4 py-2 text-sm text-text-primary hover:bg-hover'
            >
              <BookOpen size={18} />
              Documentation
            </Link>
            <button
              type='button'
              onClick={openSupport}
              className='flex items-center gap-3 px-4 py-2 text-sm text-text-primary hover:bg-hover cursor-pointer text-left'
            >
              <MessageCircleQuestion size={18} />
              Support
            </button>
          </div>

          <div className='flex items-center justify-between gap-2 px-3 py-2 border-t border-border-light'>
            <ColorModeToggle />
            <button
              type='button'
              onClick={() => signOut({ redirectTo: pathname })}
              className='flex items-center gap-1.5 text-sm font-semibold text-danger/80 hover:text-danger cursor-pointer'
            >
              Log out
              <LogOutIcon size={16} />
            </button>
          </div>
        </div>
      }
    >
      <button
        type='button'
        aria-label='Account menu'
        className='flex items-center cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-primary'
      >
        <Image
          src={user.image}
          alt={user.name}
          width={36}
          height={36}
          className='rounded-full border border-border-light'
        />
      </button>
    </Popover>
  )
}

function BoardsSection({ pathname }: Readonly<{ pathname: string | null }>) {
  const { boards } = useBoardMemberships()
  const [expanded, setExpanded] = useState(false)

  if (boards.length === 0) return

  return (
    <div className='border-b border-border-light'>
      <button
        type='button'
        onClick={() => setExpanded(prev => !prev)}
        className='w-full flex items-center justify-between px-4 py-2 text-sm font-semibold text-text-primary hover:bg-hover cursor-pointer'
      >
        <span>Boards ({boards.length})</span>
        <ChevronDown
          size={16}
          className={clsx('transition-transform', expanded && 'rotate-180')}
        />
      </button>
      {expanded && (
        <ul className='max-h-60 overflow-y-auto'>
          {boards.map(({ boardId, boardName, role }) => {
            const isCurrent = pathname === `/retro/${boardId}`
            return (
              <li key={boardId}>
                <Link
                  href={`/retro/${boardId}`}
                  className='flex items-center gap-2 pl-4 pr-3 py-2 text-sm text-text-primary hover:bg-hover'
                >
                  <span
                    aria-hidden
                    className={clsx(
                      'shrink-0 size-1.5 rounded-full',
                      isCurrent ? 'bg-primary' : 'bg-transparent',
                    )}
                  />
                  <span className='flex-1 truncate'>{boardName}</span>
                  <BoardRoleBadge role={role} variant='simple' />
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
