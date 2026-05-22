import clsx from 'clsx'
import { noop } from 'lodash'
import { Controller, useForm } from 'react-hook-form'
import { type UpsertActionItemFields, upsertActionItemResolver } from './schema'
import { Dropdown, Form } from '@/components/common'
import { EmojiTextArea } from '@/components/emoji-completion'
import { SubmitButton } from '@/components/submit-button'
import type { UpsertActionItemFormProps } from './types'

export function UpsertActionItemForm({
  onSubmit,
  defaultContent,
  defaultAssignedToId,
  defaultCardId,
  placeholder = 'We did a great job!',
  availableUsers = [],
  cardOptions,
  cardSelectionLabel = 'link to card',
  showDelete = false,
  onDelete,
}: Readonly<UpsertActionItemFormProps>) {
  const { control, formState, handleSubmit, register, setValue, watch } =
    useForm<UpsertActionItemFields>({
      resolver: upsertActionItemResolver,
      defaultValues: {
        content: defaultContent,
        assignedToId: defaultAssignedToId,
        cardId: defaultCardId,
      },
    })

  const { ref: rhfRef, onChange: rhfOnChange, ...rhfRest } = register('content')
  const selectedCardId = watch('cardId')
  const requireCardSelection = !!cardOptions && cardOptions.length > 0
  const isCardSelectionMissing = requireCardSelection && !selectedCardId

  const handleOnSubmit = (data: UpsertActionItemFields) => {
    if (requireCardSelection && !data.cardId) return
    onSubmit(data.content, data.assignedToId, data.cardId)
  }

  return (
    <Form onSubmit={handleSubmit(handleOnSubmit)}>
      {requireCardSelection && (
        <div className='mb-6'>
          <Controller
            name='cardId'
            control={control}
            render={({ field }) => (
              <Dropdown
                options={cardOptions ?? []}
                label={cardSelectionLabel}
                placeholder='Select a card'
                onSelect={selected => {
                  field.onChange(selected.value)
                }}
                width='w-full'
                size='md'
                defaultEmpty={!defaultCardId}
                defaultSelectedId={defaultCardId}
                searchable
              />
            )}
          />
        </div>
      )}
      <EmojiTextArea
        {...rhfRest}
        ref={rhfRef}
        onClick={noop}
        data-testid='content-form__content'
        placeholder={placeholder}
        rows={5}
        maxLength={256}
        tabIndex={0}
        error={formState.errors.content?.message}
        defaultValue={defaultContent}
        onChange={rhfOnChange}
        onValueChange={value =>
          setValue('content', value, {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(handleOnSubmit)()
          }
        }}
        autoFocus
      />
      {availableUsers.length > 0 && (
        <div className='mt-2 mb-6'>
          <Controller
            name='assignedToId'
            control={control}
            render={({ field }) => (
              <Dropdown
                options={availableUsers}
                label='assign to'
                placeholder='Select a Member'
                onSelect={selected => {
                  field.onChange(selected.value)
                }}
                width='w-full'
                size='md'
                defaultEmpty={!defaultAssignedToId}
                clearable
                defaultSelectedId={defaultAssignedToId}
              />
            )}
          />
        </div>
      )}
      <div className='flex justify-end items-center gap-0.5'>
        {showDelete && (
          <button
            onClick={onDelete}
            className='p-4 rounded-lg bg-danger/85 hover:bg-danger uppercase text-white font-bold cursor-pointer text-xl mr-2'
          >
            Delete
          </button>
        )}
        {requireCardSelection ? (
          <button
            type='submit'
            disabled={isCardSelectionMissing}
            className={clsx(
              'w-full p-4 rounded-lg text-text-primary font-bold uppercase text-xl',
              isCardSelectionMissing
                ? 'bg-primary/40 cursor-not-allowed'
                : 'bg-primary/85 hover:bg-primary cursor-pointer',
            )}
          >
            Submit
          </button>
        ) : (
          <SubmitButton />
        )}
      </div>
    </Form>
  )
}
