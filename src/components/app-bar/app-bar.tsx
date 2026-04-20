'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Sidebar, SidebarItem } from '../common'
import { Auth } from './auth'
import ColorModeToggle from './color-mode-toggle'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/plans', label: 'Plans' },
  { href: '/docs', label: 'Docs' },
  { href: '/me', label: 'Boards' },
] as const

function Logo() {
  return (
    <Image
      src='/logo.png'
      alt='Gr8 Retros Logo'
      width={40}
      height={40}
      className='inline-block mr-2 cursor-pointer'
    />
  )
}

export function AppBar() {
  return (
    <div className='flex items-center justify-between max-w-screen bg-appbar px-3 py-1 min-h-16'>
      <div className='flex items-center gap-4'>
        {/* Mobile: logo opens nav sidebar */}
        <div className='md:hidden'>
          <Sidebar
            trigger={
              <button type='button' aria-label='Open navigation menu'>
                <Logo />
              </button>
            }
            side='left'
          >
            <nav className='flex flex-col gap-2 p-4'>
              {navLinks.map(({ href, label }) => (
                <SidebarItem key={href}>
                  <Link
                    href={href}
                    className='block text-text-secondary hover:text-text-primary font-medium transition-colors text-lg py-2 px-3 rounded hover:bg-surface'
                  >
                    {label}
                  </Link>
                </SidebarItem>
              ))}
            </nav>
          </Sidebar>
        </div>

        {/* Desktop: logo links to home */}
        <Link
          href='/'
          className='hidden md:flex items-center text-2xl font-extrabold tracking-tight text-text-primary'
        >
          <Logo />
          Gr8 Retros
        </Link>

        {/* Desktop nav */}
        <nav className='hidden md:flex items-center gap-6 ml-6'>
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className='text-text-secondary hover:text-text-primary font-medium transition-colors text-lg'
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className='ml-auto mr-3'>
        {' '}
        <ColorModeToggle />
      </div>
      <Auth />
    </div>
  )
}
