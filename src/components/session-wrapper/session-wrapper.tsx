'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { AppBar } from '../app-bar'
import { ModalProvider } from '../modals/modal-provider'
import { AblyProvider } from '@/providers/ably'
import { BoardMembershipProvider } from '@/providers/board-memberships'

export function SessionWrapper({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <NextThemesProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
    >
      <main className='bg-page font-sans h-screen overflow-hidden'>
        <div className='flex flex-col h-full'>
          <Providers>
            <AppBar />
            {children}
            <footer className='text-sm text-text-tertiary bg-appbar/10'>
              <p className='p-1 text-center'>
                Gr8 Retros © 2026 • A simple and effective retrospective tool
                for teams
              </p>
            </footer>
          </Providers>
        </div>
      </main>
    </NextThemesProvider>
  )
}

function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AblyProvider>
      <ModalProvider>
        <SessionProvider>
          <BoardMembershipProvider>{children}</BoardMembershipProvider>
        </SessionProvider>
      </ModalProvider>
    </AblyProvider>
  )
}
