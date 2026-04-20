import { useState } from 'react'
import { SendHorizonal } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { type ContentFields, contentResolver } from './schema'
import { IconButton } from '@/components/common/button/icon-button'
import { EmojiTextArea } from '@/components/emoji-completion'
import type { AddCommentFormProps } from './types'

export function AddCommentForm({
  onSubmit,
  memberCards,
}: Readonly<AddCommentFormProps>) {
  const [selectedCardId, setSelectedCardId] = useState(
    memberCards?.[0]?.id ?? '',
  )
  const { handleSubmit, register, reset, setValue, trigger, getValues } =
    useForm<ContentFields>({
      resolver: contentResolver,
    })

  const { ref: rhfRef, onChange: rhfOnChange, ...rhfRest } = register('content')

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
      className='flex flex-col mt-4 rounded-lg w-full bg-appbar px-1'
      onSubmit={handleSubmit(handleOnSubmit)}
    >
      {memberCards && memberCards.length > 0 && (
        <select
          value={selectedCardId}
          onChange={e => setSelectedCardId(e.target.value)}
          className='mr-12 mt-2 pr-4 py-1 text-xs rounded border border-tertiary bg-page text-text-primary truncate'
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
      <div className='relative'>
        <EmojiTextArea
          {...rhfRest}
          ref={rhfRef}
          hideError
          id='add_comment'
          placeholder='Add a comment...'
          className='w-full pr-10 focus:outline-none resize-none'
          rows={3}
          onChange={rhfOnChange}
          onValueChange={value =>
            setValue('content', value, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
          onKeyDown={handleKeyDown}
        />
        <div className='absolute right-3 bottom-4.5'>
          <IconButton icon={SendHorizonal} intent='text-secondary' />
        </div>
      </div>
    </form>
  )
}
