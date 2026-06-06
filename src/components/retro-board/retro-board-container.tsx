import { RequestAccessScreen } from './request-access-screen'
import { RetroBoard } from './retro-board'
import { auth } from '@/auth'
import { boardService } from '@/server/board'

export async function RetroBoardContainer({ id }: Readonly<{ id: string }>) {
  const boardData = boardService.getBoardById(id)

  const session = await auth()

  const { board, access } = await boardData

  if (!board) {
    if (!access) {
      return (
        <p className='flex flex-col w-screen justify-center items-center h-full p-3 text-4xl'>
          This board is private.
        </p>
      )
    }
    return (
      <RequestAccessScreen access={access} isAuthenticated={!!session?.user} />
    )
  }

  return <RetroBoard board={board as any} />
}
