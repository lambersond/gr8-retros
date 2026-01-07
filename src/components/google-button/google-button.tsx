'use client'

import Image from 'next/image'
import { signIn } from 'next-auth/react'
import { GoogleButtonProps } from './types'

export function GoogleButton({ redirectTo }: Readonly<GoogleButtonProps>) {
  return (
    <button
      type='button'
      className='inline-flex items-center cursor-pointer justify-center gap-3 rounded-md bg-white/80 px-4 py-2.5 text-base font-medium text-text-primary hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/60'
      onClick={() =>
        signIn(
          'google',
          { redirectTo },
          {
            behavior: 'popup',
          },
        )
      }
    >
      <Image
        src='/google-icon-logo.svg'
        alt=''
        height={20}
        width={20}
        aria-hidden='true'
      />
      Continue with Google
    </button>
  )
}
