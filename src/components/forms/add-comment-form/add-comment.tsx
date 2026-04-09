import { useState } from 'react'
import { SendHorizonal } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { type ContentFields, contentResolver } from './schema'
import { IconButton } from '@/components/common/button/icon-button'
import type { AddCommentFormProps } from './types'

export function AddCommentForm({
  onSubmit,
  memberCards,
}: Readonly<AddCommentFormProps>) {
  const [selectedCardId, setSelectedCardId] = useState(
    memberCards?.[0]?.id ?? '',
  )
  const { handleSubmit, register, reset, trigger, getValues } =
    useForm<ContentFields>({
      resolver: contentResolver,
    })

  const handleOnSubmit = (data: ContentFields) => {
    onSubmit(data.content, memberCards ? selectedCardId : undefined)
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
      className='flex flex-col mt-4 border border-tertiary rounded-lg w-full bg-page/40'
      onSubmit={handleSubmit(handleOnSubmit)}
    >
      {memberCards && memberCards.length > 0 && (
        <select
          value={selectedCardId}
          onChange={e => setSelectedCardId(e.target.value)}
          className='mx-2 mt-2 px-2 py-1 text-xs rounded border border-tertiary bg-page text-text-primary truncate'
        >
          {memberCards.map(card => (
            <option key={card.id} value={card.id}>
              {card.content.length > 60
                ? `${card.content.slice(0, 60)}…`
                : card.content}
            </option>
          ))}
        </select>
      )}
      <div className='flex items-end p-2'>
        <textarea
          id='add_comment'
          placeholder='Add a comment...'
          className='w-full focus:outline-none resize-none'
          rows={3}
          onKeyDown={handleKeyDown}
          {...register('content')}
        />
        <IconButton icon={SendHorizonal} intent='text-secondary' />
      </div>
    </form>
  )
}
