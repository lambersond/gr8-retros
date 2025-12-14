import { RetroBoard } from './retro-board'
import { auth } from '@/auth'
import { boardService } from '@/server/board'

export async function RetroBoardContainer({
  id,
}: Readonly<{
  id: string
}>) {
  const { board } = await boardService.getBoardById(id)

  await auth()

  if (!board) {
    return (
      <p className='flex flex-col w-screen justify-center items-center h-full p-3 text-4xl'>
        Board not found.
      </p>
    )
  }

  return <RetroBoard board={board} />
}
