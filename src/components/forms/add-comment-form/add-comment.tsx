import { SendHorizonal } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { type ContentFields, contentResolver } from './schema'
import { IconButton } from '@/components/common/button/icon-button'
import type { AddCommentFormProps } from './types'

export function AddCommentForm({ onSubmit }: Readonly<AddCommentFormProps>) {
  const { handleSubmit, register } = useForm<ContentFields>({
    resolver: contentResolver,
  })

  const handleOnSubmit = (data: ContentFields) => {
    onSubmit(data.content)
  }

  return (
    <form
      className='flex align-end mt-4 p-2 border border-border rounded-lg w-full items-end'
      onSubmit={handleSubmit(handleOnSubmit)}
    >
      <textarea
        id='add_comment'
        placeholder='Add a comment...'
        className='w-full focus:outline-none resize-none'
        rows={3}
        {...register('content')}
      />
      <IconButton icon={SendHorizonal} onClick={() => {}} intent='primary' />
    </form>
  )
}
