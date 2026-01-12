'use client'

import { LogOutIcon, Menu, SidebarCloseIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { BoardSection } from './boards-section'
import { UserSection } from './user-secton'
import { IconButton, Sidebar, SidebarItem } from '@/components/common'
import { GoogleButton } from '@/components/google-button'
import { useAuth } from '@/hooks/use-auth'

export function Auth() {
  const { user, isAuthenticated, signOut } = useAuth()
  const redirectTo = usePathname()

  return (
    <Sidebar
      side='right'
      trigger={<IconButton icon={Menu} size='xl' />}
      className='w-full sm:w-sm shadow-xl'
    >
      <div className='flex flex-col gap-3 px-2 h-full'>
        <section className='flex items-start justify-between sticky top-0 bg-appbar z-10 -mb-3'>
          <div className='flex flex-col'>
            <p className='text-2xl font-bold'>Account</p>
          </div>
          <SidebarItem>
            <SidebarCloseIcon className='size-10 p-2 transform rotate-180 text-text-secondary hover:text-text-primary hover:bg-hover rounded-full cursor-pointer' />
          </SidebarItem>
        </section>
        <UserSection user={user} isAuthenticated={isAuthenticated} />
        {!isAuthenticated && <GoogleButton redirectTo={redirectTo} />}
        <BoardSection isAuthenticated={isAuthenticated} />
        <div className='flex-1' id='spacer' />
        {isAuthenticated && (
          <section className='p-2'>
            <SidebarItem>
              <button
                onClick={() => signOut({ redirectTo })}
                className='w-full flex gap-2 cursor-pointer w-full items-start'
              >
                <LogOutIcon className='text-danger/80 size-6 mb-2' />
                <p className='h-6 text-danger/80 font-bold'>Sign Out</p>
              </button>
            </SidebarItem>
          </section>
        )}
      </div>
    </Sidebar>
  )
}
