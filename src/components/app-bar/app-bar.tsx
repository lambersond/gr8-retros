import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Auth } from './auth'
import ColorModeToggle from './color-mode-toggle'

export function AppBar() {
  const pathname = usePathname()
  const isRetroPage = pathname.startsWith('/retro/')

  return (
    <div className='flex items-center justify-between max-w-screen bg-appbar px-3 py-1 min-h-16'>
      <div className='flex items-center gap-4'>
        <span className='text-2xl font-extrabold tracking-tight text-text-primary'>
          <Image
            src='/logo.png'
            alt='Gr8 Retros Logo'
            width={40}
            height={40}
            className='inline-block mr-2'
          />
          Gr8 Retros
        </span>
        {!isRetroPage && (
          <nav className='flex items-center gap-6 ml-6'>
            <Link
              href='/plans'
              className='text-text-secondary hover:text-text-primary font-medium transition-colors text-lg'
            >
              Plans
            </Link>
            <Link
              href='/me'
              className='text-text-secondary hover:text-text-primary font-medium transition-colors text-lg'
            >
              Boards
            </Link>
          </nav>
        )}
      </div>
      <div className='ml-auto mr-3'>
        {' '}
        <ColorModeToggle />
      </div>
      <Auth />
    </div>
  )
}
