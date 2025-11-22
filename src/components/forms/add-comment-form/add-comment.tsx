import { SendHorizonal } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { type ContentFields, contentResolver } from './schema'
import { IconButton } from '@/components/common/button/icon-button'
import type { AddCommentFormProps } from './types'

export function AddCommentForm({ onSubmit }: Readonly<AddCommentFormProps>) {
  const { handleSubmit, register, reset, trigger, getValues } =
    useForm<ContentFields>({
      resolver: contentResolver,
    })

  const handleOnSubmit = (data: ContentFields) => {
    onSubmit(data.content)
    reset()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      trigger().then(isValid => {
        if (isValid) {
          handleOnSubmit({ content: getValues('content') })
          reset()
        }
      })
    }
  }

  return (
    <form
      className='flex align-end mt-4 p-2 border border-tertiary rounded-lg w-full items-end bg-page/40'
      onSubmit={handleSubmit(handleOnSubmit)}
    >
      <textarea
        id='add_comment'
        placeholder='Add a comment...'
        className='w-full focus:outline-none resize-none'
        rows={3}
        onKeyDown={handleKeyDown}
        {...register('content')}
      />
      <IconButton icon={SendHorizonal} intent='primary' />
    </form>
  )
}
