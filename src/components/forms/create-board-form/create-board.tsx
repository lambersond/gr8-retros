import { useForm } from 'react-hook-form'
import { CreateBoardFields, createBoardResolver } from './schema'
import type { CreateBoardFormProps } from './types'

export function CreateBoardForm({ onSubmit }: Readonly<CreateBoardFormProps>) {
  const { handleSubmit, reset } = useForm<CreateBoardFields>({
    resolver: createBoardResolver,
  })

  const handleOnSubmit = (data: CreateBoardFields) => {
    onSubmit({ boardId: data.boardId, boardName: data.boardName })
    reset()
  }

  return (
    <form
      className='flex align-end mt-4 p-2 border border-tertiary rounded-lg w-full items-end bg-page/40'
      onSubmit={handleSubmit(handleOnSubmit)}
    ></form>
  )
}
