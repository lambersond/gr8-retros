'use client'

import Image from 'next/image'
import { signIn } from 'next-auth/react'
import { Modal } from '@/components/common'
import { useModals } from '@/hooks/use-modals'
import type { SignInModalProps } from './types'

export function SignInModal({
  open = true,
  redirectTo = '/',
}: Readonly<SignInModalProps>) {
  const { closeModal } = useModals()

  const onClose = () => {
    closeModal('SignInModal')
  }

  const handleSignIn = (provider: string) => {
    signIn(provider, { redirectTo }, { behavior: 'popup' })
  }

  return (
    <Modal title='Sign In' isOpen={open} onClose={onClose}>
      <div className='flex flex-col gap-3 py-4'>
        <button
          type='button'
          className='inline-flex items-center cursor-pointer justify-center gap-3 rounded-md border border-transparent bg-black/80 px-4 py-2.5 text-base font-medium text-white hover:border-primary hover:bg-black focus:outline-none focus:ring-2 focus:ring-white/60'
          onClick={() => handleSignIn('google')}
        >
          <Image
            src='/google-icon-logo.svg'
            alt=''
            height={20}
            width={20}
            aria-hidden='true'
            className='h-auto'
          />
          Continue with Google
        </button>
        <button
          type='button'
          className='inline-flex items-center cursor-pointer justify-center gap-3 rounded-md border border-transparent bg-[#5865F2] px-4 py-2.5 text-base font-medium text-white hover:border-primary hover:bg-[#4752C4] focus:outline-none focus:ring-2 focus:ring-white/60'
          onClick={() => handleSignIn('discord')}
        >
          <Image
            src='/discord-icon-logo.svg'
            alt=''
            height={20}
            width={20}
            aria-hidden='true'
            className='h-auto'
          />
          Continue with Discord
        </button>
        <button
          type='button'
          className='inline-flex items-center cursor-pointer justify-center gap-3 rounded-md border border-transparent bg-[#24292f] px-4 py-2.5 text-base font-medium text-white hover:border-primary hover:bg-[#1b1f23] focus:outline-none focus:ring-2 focus:ring-white/60'
          onClick={() => handleSignIn('github')}
        >
          <Image
            src='/github-icon-logo.svg'
            alt=''
            height={20}
            width={20}
            aria-hidden='true'
            className='invert h-auto'
          />
          Continue with GitHub
        </button>
      </div>
    </Modal>
  )
}
