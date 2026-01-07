import { GoogleButton } from '../google-button'
import type { SignInGateProps } from './types'

export function SignInGate({
  isPrivate,
  onContinueAsGuest,
}: Readonly<SignInGateProps>) {
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
          <GoogleButton redirectTo={globalThis.location.href} />
          <button
            type='button'
            className='inline-flex items-center cursor-pointer justify-center rounded-md border border-zinc-700 bg-zinc-600 px-4 py-2.5 text-base font-medium text-zinc-100 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-400/50'
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
