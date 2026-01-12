import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { GoogleButton } from '../google-button'
import { auth } from '@/auth'
import { boardInviteService } from '@/server/board-invite'

export async function JoinLink({
  token,
}: Readonly<{
  token: string
}>) {
  const invite = await boardInviteService.getBoardInviteByToken(token)

  if (!invite) {
    notFound()
  }

  const canAccessAsGuest =
    !invite.boardSettings.isPrivate || invite.boardSettings.privateOpenAccess

  const privateText = invite.boardSettings.isPrivate ? 'private' : 'public'

  const session = await auth()
  const canJoinAsUser = !!session?.user?.id

  if (canJoinAsUser) {
    const boardId = await boardInviteService.acceptBoardInvite(
      token,
      session.user.id,
    )
    redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/retro/${boardId}`)
  }

  return (
    <div className='flex align-center flex h-full w-screen items-center justify-center px-4 py-8'>
      <div className='w-full max-w-lg rounded-xl bg-appbar p-6 shadow-xl flex flex-col gap-6'>
        <header className='space-y-2'>
          <h1 className='text-3xl font-bold'>Welcome to Gr8 Retros!</h1>
          <p className='text-sm text-text-primary/80'>
            You are accessing an invitation to join a {privateText} board. Such
            excitement!
          </p>
        </header>

        {!canAccessAsGuest && (
          <p className='text-base text-text-primary'>
            To access this board, you need to sign in to continue.
          </p>
        )}

        <div className='flex flex-col gap-3'>
          <GoogleButton
            redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/invite/${token}`}
          />
          {canAccessAsGuest && (
            <Link
              className='inline-flex items-center cursor-pointer justify-center rounded-md border border-zinc-700 bg-zinc-600 px-4 py-2.5 text-base font-medium text-zinc-100 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-400/50'
              href={`${process.env.NEXT_PUBLIC_SITE_URL}/retro/${invite.boardSettings.retroSessionId}?guest=true`}
              referrerPolicy='no-referrer'
            >
              Continue as guest
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
