import Image from 'next/image'
import { Auth } from './auth'
import ColorModeToggle from './color-mode-toggle'

export function AppBar() {
  return (
    <div className='flex items-center justify-between max-w-screen bg-appbar px-3 py-1 min-h-16'>
      <div className='flex items-baseline gap-2'>
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
      </div>
      <div className='ml-auto mr-3'>
        {' '}
        <ColorModeToggle />
      </div>
      <Auth />
    </div>
  )
}
