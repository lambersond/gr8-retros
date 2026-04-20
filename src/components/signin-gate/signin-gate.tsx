import { LogInIcon } from 'lucide-react'
import { useModals } from '@/hooks/use-modals'
import type { SignInGateProps } from './types'

export function SignInGate({
  isPrivate,
  onContinueAsGuest,
}: Readonly<SignInGateProps>) {
  const { openModal } = useModals()

  return (
    <div className='flex align-center flex h-full w-screen items-center justify-center px-4 py-8'>
      <div className='w-full max-w-lg rounded-xl bg-appbar p-6 shadow-xl flex flex-col gap-6'>
        <header className='space-y-2'>
          <h1 className='text-3xl font-bold'>Welcome to Gr8 Retros!</h1>
          <p className='text-sm text-text-primary/80'>
            This is a{' '}
            <span className='font-semibold'>
              {isPrivate ? 'private' : 'public'}
            </span>{' '}
            board.
          </p>
        </header>

        <p className='text-base text-text-primary'>
          Sign in to sync your boards across devices. Or continue as a guest.
        </p>
        <div className='flex flex-col gap-3'>
          <button
            type='button'
            className='inline-flex items-center cursor-pointer justify-center gap-3 rounded-md border border-transparent bg-black/80 px-4 py-2.5 text-base font-medium text-white hover:border-primary hover:bg-black focus:outline-none focus:ring-2 focus:ring-white/60'
            onClick={() =>
              openModal('SignInModal', {
                redirectTo: globalThis.location.href,
              } as any)
            }
          >
            <LogInIcon className='size-5' />
            Sign In
          </button>
          <button
            type='button'
            className='inline-flex items-center cursor-pointer justify-center rounded-md border border-border-light bg-tertiary px-4 py-2.5 text-base font-medium text-text-primary hover:bg-zinc-300 dark:hover:bg-primary focus:outline-none'
            onClick={onContinueAsGuest}
          >
            Continue as guest
          </button>
        </div>
        <p className='text-xs text-text-primary/60'>
          You can sign in later from the menu.
        </p>
      </div>
    </div>
  )
}
