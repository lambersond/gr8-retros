'use client'

import { LogOutIcon, Menu, SidebarCloseIcon } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { IconButton, Sidebar, SidebarItem } from '@/components/common'
import { useAuth } from '@/hooks/use-auth'

export function Auth() {
  const { user, isAuthenticated, signIn, signOut } = useAuth()
  const redirectTo = usePathname()

  return (
    <Sidebar
      side='right'
      trigger={<IconButton icon={Menu} size='xl' />}
      className='w-full sm:w-sm shadow-xl'
    >
      <div className='flex flex-col gap-4 p-2 pt-0 h-full'>
        <section className='flex items-start justify-between border-b border-border sticky top-0 bg-appbar z-10 pb-4'>
          <div className='flex flex-col'>
            <p className='text-2xl font-bold'>Account</p>
            <p className='text-lg italic text-text-secondary -mt-1'>
              {user.name}
            </p>
          </div>
          <SidebarItem>
            <SidebarCloseIcon className='size-10 p-2 transform rotate-180 text-text-secondary hover:text-text-primary hover:bg-hover rounded-full cursor-pointer' />
          </SidebarItem>
        </section>
        <section className='flex flex-col border-b border-border pb-4'>
          <p className='font-bold text-lg'>Account Settings</p>
          <div>
            <p className='font-bold'>Google:</p>
            {user.isGoogleLinked ? (
              <p>{user.email}</p>
            ) : (
              <button
                className='flex gap-2 px-4 py-2 border border-tertiary rounded-lg items-center hover:bg-white bg-white/80 mt-2 cursor-pointer'
                onClick={() => signIn('google')}
              >
                <Image
                  src='/google-icon-logo.svg'
                  alt='Sign in with Google'
                  height={24}
                  width={24}
                />
                Continue with Google
              </button>
            )}
          </div>
          <p className='hidden'>
            <b>Patreon:</b> {user.isPatreonLinked ? 'Linked' : 'Not Linked'}
          </p>
        </section>
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
