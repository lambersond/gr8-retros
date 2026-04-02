import { RetroBoard } from './retro-board'
import { auth } from '@/auth'
import { boardService } from '@/server/board'

export async function RetroBoardContainer({ id }: Readonly<{ id: string }>) {
  const boardData = boardService.getBoardById(id)

  await auth()

  const { board } = await boardData

  if (!board) {
    return (
      <p className='flex flex-col w-screen justify-center items-center h-full p-3 text-4xl'>
        This board is private.
      </p>
    )
  }

  return <RetroBoard board={board as any} />
}
